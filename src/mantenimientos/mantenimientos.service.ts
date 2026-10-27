import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, In, Repository } from 'typeorm';
import { AuthUser } from '../common/decorators/current-user.decorator.js';
import { EstadoMantenimiento, Rol, EstadoVehiculo } from '../common/enum.js';
import { Mecanico } from '../mecanicos/entities/mecanico.entity.js';
import { Vehiculo } from '../vehiculos/entities/vehiculo.entity.js';
import { Taller } from '../talleres/entities/taller.entity.js';
import { CreateMantenimientoDto } from './dto/create-mantenimiento.dto.js';
import { UpdateEstadoMantenimientoDto } from './dto/update-mantenimiento.dto.js';
import { Mantenimiento } from './entities/mantenimiento.entity.js';
import {
  ACTIVE_STATUSES,
  assertClosingData,
  assertValidTransition,
} from './mantenimientos.reglas.js';

@Injectable()
export class MantenimientosService {
  constructor(
    @InjectRepository(Mantenimiento)
    private readonly mantenimientos: Repository<Mantenimiento>,
    @InjectRepository(Vehiculo) private readonly vehiculos: Repository<Vehiculo>,
    @InjectRepository(Mecanico)
    private readonly mecanicos: Repository<Mecanico>,
    private readonly dataSource: DataSource,
  ) {}

  // =====================================================================
  // CREAR MANTENIMIENTO
  // TRANSACCIÓN: todo ocurre dentro de una transacción. Bloqueamos (lock) las filas
  // del vehículo y del mecánico para que dos peticiones simultáneas no creen cruces.
  // =====================================================================
  async create(dto: CreateMantenimientoDto) {
    return this.dataSource.transaction(async (em) => {
      const vehiculo = await em.findOne(Vehiculo, {
        where: { id: dto.vehiculoId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!vehiculo)
        throw new NotFoundException(
          `Vehículo con id ${dto.vehiculoId} no existe`,
        );
      if (vehiculo.estado === EstadoVehiculo.INACTIVE) {
        throw new ConflictException(
          `El vehículo ${vehiculo.placa} está INACTIVO y no admite nuevos mantenimientos`,
        );
      }

      const mecanico = await em.findOne(Mecanico, {
        where: { id: dto.mecanicoId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!mecanico)
        throw new NotFoundException(
          `Mecánico con id ${dto.mecanicoId} no existe`,
        );
      if (!mecanico.activo)
        throw new ConflictException(
          `El mecánico ${mecanico.nombre} está inactivo`,
        );

      const taller = await em.findOne(Taller, {
        where: { id: dto.tallerId },
      });
      if (!taller)
        throw new NotFoundException(
          `Taller con id ${dto.tallerId} no existe`,
        );
      if (!taller.activo)
        throw new ConflictException(`El taller ${taller.nombre} está inactivo`);

      if (dto.kilometraje < vehiculo.kilometraje) {
        throw new BadRequestException(
          `El kilometraje (${dto.kilometraje}) no puede ser menor al actual del vehículo (${vehiculo.kilometraje})`,
        );
      }

      const start = new Date(dto.fechaProgramada);
      const end = new Date(
        start.getTime() + (dto.duracionMinutos ?? 60) * 60_000,
      );

      // Regla: un vehículo no puede tener más de un mantenimiento activo
      const vehicleBusy = await em.count(Mantenimiento, {
        where: { vehiculoId: vehiculo.id, estado: In(ACTIVE_STATUSES) },
      });
      if (vehicleBusy > 0) {
        throw new ConflictException(
          `El vehículo ${vehiculo.placa} ya tiene un mantenimiento activo`,
        );
      }

      // Regla: un mecánico no puede tener horarios cruzados (en ningún taller).
      // Hay cruce si: inicioExistente < finNuevo  Y  finExistente > inicioNuevo.
      // Así 7:30-9:00 y otro desde las 9:00 NO se cruzan (permitido).
      const overlap = await em
        .createQueryBuilder(Mantenimiento, 'm')
        .where('m.mecanicoId = :mecanicoId', { mecanicoId: mecanico.id })
        .andWhere('m.status IN (:...active)', { active: ACTIVE_STATUSES })
        .andWhere('m.scheduledAt < :end AND m.scheduledEnd > :start', {
          start,
          end,
        })
        .getOne();
      if (overlap) {
        throw new ConflictException(
          `El mecánico ${mecanico.nombre} ya tiene un mantenimiento activo que se cruza con ese horario ` +
            `(${overlap.fechaProgramada.toISOString()} a ${overlap.fechaFinalizacion.toISOString()})`,
        );
      }

      const created = await em.save(
        em.create(Mantenimiento, {
          tipo: dto.tipo,
          descripcion: dto.descripcion,
          kilometraje: dto.kilometraje,
          fechaProgramada: start,
          fechaFinalizacion: end,
          estado: EstadoMantenimiento.SCHEDULED,
          vehiculoId: vehiculo.id,
          mecanicoId: mecanico.id,
          tallerId: taller.id,
        }),
      );
      return em.findOneOrFail(Mantenimiento, { where: { id: created.id } });
    });
  }

  // =====================================================================
  // CAMBIAR ESTADO
  // TRANSACCIÓN: el cambio del mantenimiento y el del vehículo se guardan juntos
  // (o se guardan los dos, o no se guarda ninguno).
  // =====================================================================
  // Actualiza el estado de una orden según el usuario y los datos recibidos.
  async updateStatus(
    id: number,
    dto: UpdateEstadoMantenimientoDto,
    user: AuthUser,
  ) {
    return this.dataSource.transaction(async (em) => {
      const mantenimiento = await em.findOne(Mantenimiento, {
        where: { id },
        loadEagerRelations: false,
        lock: { mode: 'pessimistic_write' },
      });
      if (!mantenimiento)
        throw new NotFoundException(`Mantenimiento con id ${id} no encontrado`);

      // Un técnico solo puede tocar los mantenimientos asignados a él
      if (user.role === Rol.TECHNICIAN)
        await this.assertAssignedTo(em, mantenimiento, user.id);

      assertValidTransition(mantenimiento.estado, dto.estado);

      const vehiculo = await em.findOneOrFail(Vehiculo, {
        where: { id: mantenimiento.vehiculoId },
        lock: { mode: 'pessimistic_write' },
      });

      switch (dto.estado) {
        case EstadoMantenimiento.IN_PROGRESS:
          if (vehiculo.estado === EstadoVehiculo.INACTIVE) {
            throw new ConflictException(
              `El vehículo ${vehiculo.placa} está INACTIVO`,
            );
          }
          vehiculo.estado = EstadoVehiculo.IN_MAINTENANCE;
          break;

        case EstadoMantenimiento.COMPLETED:
          assertClosingData(dto);
          if (dto.kilometrajeFinal! < vehiculo.kilometraje) {
            throw new BadRequestException(
              `El kilometraje final (${dto.kilometrajeFinal}) no puede ser menor al actual del vehículo (${vehiculo.kilometraje})`,
            );
          }
          mantenimiento.trabajoRealizado = dto.trabajoRealizado!;
          mantenimiento.costoFinal = dto.costoFinal!;
          mantenimiento.finishedAt = new Date(dto.finishedAt!);
          mantenimiento.kilometraje = dto.kilometrajeFinal!;
          vehiculo.kilometraje = dto.kilometrajeFinal!;
          if (vehiculo.estado !== EstadoVehiculo.INACTIVE)
            vehiculo.estado = EstadoVehiculo.AVAILABLE;
          break;

        case EstadoMantenimiento.CANCELLED:
          // Si el vehículo estaba en mantenimiento por este trabajo, vuelve a estar disponible
          if (vehiculo.estado === EstadoVehiculo.IN_MAINTENANCE)
            vehiculo.estado = EstadoVehiculo.AVAILABLE;
          break;
      }

      mantenimiento.estado = dto.estado;
      await em.save(vehiculo);
      await em.save(mantenimiento);
      return em.findOneOrFail(Mantenimiento, { where: { id } });
    });
  }

  // ---------------------------- CONSULTAS ----------------------------
  findAll() {
    return this.mantenimientos.find({ order: { fechaProgramada: 'DESC' } });
  }

  findActive() {
    return this.mantenimientos.find({
      where: { estado: In(ACTIVE_STATUSES) },
      order: { fechaProgramada: 'ASC' },
    });
  }

  async findByVehicle(vehiculoId: number) {
    await this.assertVehicleExists(vehiculoId);
    return this.mantenimientos.find({
      where: { vehiculoId },
      order: { fechaProgramada: 'DESC' },
    });
  }

  /** Historial = mantenimientos ya COMPLETADOS del vehículo, del más reciente al más antiguo */
  // Recupera el historial de mantenimientos asociados a un vehículo.
  async findHistoryByVehicle(vehiculoId: number) {
    await this.assertVehicleExists(vehiculoId);
    return this.mantenimientos.find({
      where: { vehiculoId, estado: EstadoMantenimiento.COMPLETED },
      order: { finishedAt: 'DESC' },
    });
  }

  async findByMechanic(mecanicoId: number) {
    if (!(await this.mecanicos.findOne({ where: { id: mecanicoId } }))) {
      throw new NotFoundException(`Mecánico con id ${mecanicoId} no existe`);
    }
    return this.mantenimientos.find({
      where: { mecanicoId },
      order: { fechaProgramada: 'DESC' },
    });
  }

  /** Mantenimientos asignados al técnico que hace la petición */
  async findMine(usuarioId: number) {
    const mecanico = await this.mecanicos.findOne({ where: { usuarioId } });
    if (!mecanico) return [];
    return this.mantenimientos.find({
      where: { mecanicoId: mecanico.id },
      order: { fechaProgramada: 'DESC' },
    });
  }

  async findOne(id: number, user: AuthUser) {
    const mantenimiento = await this.mantenimientos.findOne({ where: { id } });
    if (!mantenimiento)
      throw new NotFoundException(`Mantenimiento con id ${id} no encontrado`);
    if (user.role === Rol.TECHNICIAN)
      await this.assertAssignedTo(
        this.dataSource.manager,
        mantenimiento,
        user.id,
      );
    return mantenimiento;
  }

  private async assertVehicleExists(vehiculoId: number) {
    if (!(await this.vehiculos.findOne({ where: { id: vehiculoId } }))) {
      throw new NotFoundException(`Vehículo con id ${vehiculoId} no existe`);
    }
  }

  private async assertAssignedTo(
    em: EntityManager,
    mantenimiento: Mantenimiento,
    usuarioId: number,
  ) {
    const mechanic = await em.findOne(Mecanico, { where: { usuarioId } });
    if (!mechanic || mechanic.id !== mantenimiento.mecanicoId) {
      throw new ForbiddenException('Este mantenimiento no está asignado a ti');
    }
  }
}

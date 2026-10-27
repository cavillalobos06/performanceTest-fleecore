import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { EstadoMantenimiento, EstadoVehiculo } from '../common/enum.js';
import { Mantenimiento } from '../mantenimientos/entities/mantenimiento.entity.js';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto.js';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto.js';
import { Vehiculo } from './entities/vehiculo.entity.js';

@Injectable()
export class VehiculosService {
  constructor(
    @InjectRepository(Vehiculo)
    private readonly vehiculos: Repository<Vehiculo>,
    @InjectRepository(Mantenimiento)
    private readonly mantenimientos: Repository<Mantenimiento>,
  ) {}

  // Registra un vehículo con los datos enviados por el cliente.
  async create(dto: CreateVehiculoDto) {
    if (await this.vehiculos.findOne({ where: { placa: dto.placa } })) {
      throw new ConflictException(
        `Ya existe un vehículo con la placa ${dto.placa}`,
      );
    }
    return this.vehiculos.save(this.vehiculos.create(dto));
  }

  findAll() {
    return this.vehiculos.find({
      where: { estado: Not(EstadoVehiculo.INACTIVE) },
      order: { id: 'ASC' },
    });
  }

  findInactive() {
    return this.vehiculos.find({
      where: { estado: EstadoVehiculo.INACTIVE },
      order: { id: 'ASC' },
    });
  }

  private async findByIdRaw(id: number) {
    const vehiculo = await this.vehiculos.findOne({ where: { id } });
    if (!vehiculo)
      throw new NotFoundException(`Vehículo con id ${id} no encontrado`);
    return vehiculo;
  }

  async findOne(id: number) {
    const vehiculo = await this.vehiculos.findOne({ where: { id } });
    if (!vehiculo || vehiculo.estado === EstadoVehiculo.INACTIVE)
      throw new NotFoundException(`Vehículo con id ${id} no encontrado`);
    return vehiculo;
  }

  // Busca un vehículo usando su placa como identificador.
  async findByPlate(placa: string) {
    if (!placa) {
      throw new BadRequestException('La placa es requerida');
    }
    const vehiculo = await this.vehiculos.findOne({
      where: { placa: placa.trim().toUpperCase() },
    });
    if (!vehiculo || vehiculo.estado === EstadoVehiculo.INACTIVE)
      throw new NotFoundException(`Vehículo con placa ${placa} no encontrado`);
    return vehiculo;
  }

  async update(id: number, dto: UpdateVehiculoDto) {
    const vehiculo = await this.findByIdRaw(id);
    if (dto.placa && dto.placa !== vehiculo.placa) {
      if (await this.vehiculos.findOne({ where: { placa: dto.placa } })) {
        throw new ConflictException(
          `Ya existe un vehículo con la placa ${dto.placa}`,
        );
      }
    }
    if (dto.estado === EstadoVehiculo.INACTIVE)
      await this.assertNoActiveMaintenance(vehiculo);
    Object.assign(vehiculo, dto);
    return this.vehiculos.save(vehiculo);
  }

  /** Eliminación lógica: pasa a INACTIVE, así el historial de mantenimientos se conserva. */
  async remove(id: number) {
    const vehiculos = await this.findOne(id);
    await this.assertNoActiveMaintenance(vehiculos);
    vehiculos.estado = EstadoVehiculo.INACTIVE;
    return this.vehiculos.save(vehiculos);
  }

  private async assertNoActiveMaintenance(vehiculos: Vehiculo) {
    const active = await this.mantenimientos.count({
      where: {
        vehiculoId: vehiculos.id,
        estado: In([
          EstadoMantenimiento.SCHEDULED,
          EstadoMantenimiento.IN_PROGRESS,
        ]),
      },
    });
    if (active > 0) {
      throw new ConflictException(
        `El vehículo ${vehiculos.placa} tiene un mantenimiento activo y no puede inactivarse`,
      );
    }
  }
}

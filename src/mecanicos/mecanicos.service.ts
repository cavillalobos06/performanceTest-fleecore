import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../auth/user.entity.js';
import { CreateMecanicoDto } from './dto/create-mecanico.dto.js';
import { UpdateMecanicoDto } from './dto/update-mecanico.dto.js';
import { Mecanico } from './entities/mecanico.entity.js';

@Injectable()
export class MecanicosService {
  constructor(
    @InjectRepository(Mecanico)
    private readonly mecanicos: Repository<Mecanico>,
    @InjectRepository(Usuario) private readonly users: Repository<Usuario>,
  ) {}

  async create(dto: CreateMecanicoDto) {
    await this.assertEmailFree(dto.correo);
    await this.assertUserValid(dto.userId);
    return this.mecanicos.save(
      this.mecanicos.create({ ...dto, usuarioId: dto.userId ?? null }),
    );
  }

  findAll() {
    return this.mecanicos.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number) {
    const mecanico = await this.mecanicos.findOne({ where: { id } });
    if (!mecanico)
      throw new NotFoundException(`Mecánico con id ${id} no encontrado`);
    return mecanico;
  }

  async update(id: number, dto: UpdateMecanicoDto) {
    const mecanico = await this.findOne(id);
    if (dto.correo && dto.correo !== mecanico.correo)
      await this.assertEmailFree(dto.correo);
    if (dto.userId !== undefined && dto.userId !== mecanico.usuarioId)
      await this.assertUserValid(dto.userId);
    Object.assign(mecanico, dto);
    return this.mecanicos.save(mecanico);
  }

  // Activa o desactiva al mecánico sin eliminar su registro.
  async setActive(id: number, isActive: boolean) {
    const mecanico = await this.findOne(id);
    mecanico.activo = isActive;
    return this.mecanicos.save(mecanico);
  }

  private async assertEmailFree(correo: string) {
    if (await this.mecanicos.findOne({ where: { correo } })) {
      throw new ConflictException(
        `Ya existe un mecánico con el correo ${correo}`,
      );
    }
  }

  private async assertUserValid(usuarioId?: number) {
    if (usuarioId === undefined || usuarioId === null) return;
    if (!(await this.users.findOne({ where: { id: usuarioId } }))) {
      throw new NotFoundException(`Usuario con id ${usuarioId} no encontrado`);
    }
    if (await this.mecanicos.findOne({ where: { usuarioId } })) {
      throw new ConflictException(
        `El usuario ${usuarioId} ya está vinculado a otro mecánico`,
      );
    }
  }
}

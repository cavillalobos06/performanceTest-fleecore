import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTallerDto } from './dto/create-taller.dto.js';
import { UpdateTallerDto } from './dto/update-taller.dto.js';
import { Taller } from './entities/taller.entity.js';

@Injectable()
export class TalleresService {
  constructor(
    @InjectRepository(Taller)
    private readonly talleres: Repository<Taller>,
  ) {}

  create(dto: CreateTallerDto) {
    return this.talleres.save(this.talleres.create(dto));
  }

  findActive() {
    return this.talleres.find({
      where: { activo: true },
      order: { id: 'ASC' },
    });
  }

  findAll() {
    return this.talleres.find({ order: { id: 'ASC' } });
}

  async findOne(id: number) {
    const taller = await this.talleres.findOne({ where: { id } });
    if (!taller)
      throw new NotFoundException(`Taller con id ${id} no encontrado`);
    return taller;
  }

  async update(id: number, dto: UpdateTallerDto) {
    const taller = await this.findOne(id);
    Object.assign(taller, dto);
    return this.talleres.save(taller);
}

  // Cambia la disponibilidad del taller.
  async setActive(id: number, isActive: boolean) {
    const taller = await this.findOne(id);
    taller.activo = isActive;
    return this.talleres.save(taller);
  }
}

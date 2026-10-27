import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../auth/user.entity.js';
import { MecanicosController } from './mecanicos.controller.js';
import { Mecanico } from './entities/mecanico.entity.js';
import { MecanicosService } from './mecanicos.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Mecanico, Usuario])],
  controllers: [MecanicosController],
  providers: [MecanicosService],
})
export class MecanicosModule {}

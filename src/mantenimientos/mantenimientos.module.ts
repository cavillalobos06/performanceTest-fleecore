import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mecanico } from '../mecanicos/entities/mecanico.entity.js';
import { Vehiculo } from '../vehiculos/entities/vehiculo.entity.js';
import { Taller } from '../talleres/entities/taller.entity.js';
import { MantenimientosController } from './mantenimientos.controller.js';
import { MantenimientosService } from './mantenimientos.service.js';
import { Mantenimiento } from './entities/mantenimiento.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Mantenimiento, Vehiculo, Mecanico, Taller]),
  ],
  controllers: [MantenimientosController],
  providers: [MantenimientosService],
  exports: [MantenimientosService],
})
export class MantenimientosModule {}

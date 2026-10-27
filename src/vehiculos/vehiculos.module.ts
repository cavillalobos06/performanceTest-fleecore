import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mantenimiento } from '../mantenimientos/entities/mantenimiento.entity.js';
import { VehiculosController } from './vehiculos.controller.js';
import { VehiculosService } from './vehiculos.service.js';
import { Vehiculo } from './entities/vehiculo.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Vehiculo, Mantenimiento])],
  controllers: [VehiculosController],
  providers: [VehiculosService],
  exports: [VehiculosService],
})
export class VehiculosModule {}

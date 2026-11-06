import { Module } from '@nestjs/common';
import { MantenimientosModule } from '../mantenimientos/mantenimientos.module.js';
import { VehiculosModule } from '../vehiculos/vehiculos.module.js';
import { IntegrationsController } from './integrations.controller.js';

@Module({
  imports: [VehiculosModule, MantenimientosModule],
  controllers: [IntegrationsController],
})
export class IntegrationsModule {}

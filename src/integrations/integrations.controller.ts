import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator.js';
import { ApiKeyGuard } from '../common/guards/api-key.guard.js';
import { MantenimientosService } from '../mantenimientos/mantenimientos.service.js';
import { VehiculosService } from '../vehiculos/vehiculos.service.js';
import { EstadoVehiculo } from '../common/enum.js';


@ApiTags('integrations')
@Public()
@UseGuards(ApiKeyGuard)
@Controller('integrations')
@ApiSecurity('x-api-key')
export class IntegrationsController {
  constructor(
    private readonly vehiculos: VehiculosService,
    private readonly mantenimientos: MantenimientosService,
  ) {}

  @Get('vehiculos/:placa/historial-mantenimiento')
  @ApiOperation({ summary: 'Consultar el historial de mantenimiento de un vehículo mediante una clave de integración' })
  async history(@Param('placa') placa: string) {
    const vehiculo = await this.vehiculos.findByPlate(placa);
    const historial = await this.mantenimientos.findHistoryByVehicle(vehiculo.id);
    return {
      vehicle: {
        id: vehiculo.id,
        placa: vehiculo.placa,
        marca: vehiculo.marca,
        modelo: vehiculo.modelo,
        estado: vehiculo.estado === EstadoVehiculo.AVAILABLE,
      },
      mantenimientos: historial.map((m) => ({
        id: m.id,
        tipo: m.tipo,
        estado: m.estado,
        descripcion: m.trabajoRealizado ?? m.descripcion,
        kilometraje: m.kilometrajeFinal ?? m.kilometraje,
        costo: m.costoFinal,
        finishedAt: m.finishedAt,
        mecanico: { id: m.mecanico.id, name: m.mecanico.nombre },
        taller: { id: m.taller.id, name: m.taller.nombre },
      })),
    };
  }
}

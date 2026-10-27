import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  AuthUser,
  CurrentUser,
} from '../common/decorators/current-user.decorator.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { Rol } from '../common/enum.js';
import { CreateMantenimientoDto } from './dto/create-mantenimiento.dto.js';
import { UpdateEstadoMantenimientoDto } from './dto/update-mantenimiento.dto.js';
import { MantenimientosService } from './mantenimientos.service.js';
import { TipoMantenimiento } from '../common/enum.js';

@ApiTags('mantenimientos')
@ApiBearerAuth()
@Controller('mantenimientos')
export class MantenimientosController {
  constructor(private readonly service: MantenimientosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una orden de mantenimiento' })
  @Roles(Rol.ADMIN)
  @ApiBody({
    type: CreateMantenimientoDto,
    description: 'Datos para crear una orden de mantenimiento',
    examples: {
      preventive: {
        summary: 'Mantenimiento preventivo',
        value: {
          tipo: TipoMantenimiento.PREVENTIVE,
          descripcion: 'Cambio de aceite y filtros de aire',
          kilometraje: 45000,
          fechaProgramada: '2026-10-28T08:00:00.000Z',
          duracionMinutos: 120,
          vehiculoId: 1,
          mecanicoId: 3,
          tallerId: 2,
        },
      },
      corrective: {
        summary: 'Mantenimiento correctivo',
        value: {
          tipo: TipoMantenimiento.CORRECTIVE,
          descripcion: 'Reemplazo de pastillas de freno',
          kilometraje: 80000,
          fechaProgramada: '2026-10-28T09:30:00.000Z',
          duracionMinutos: 90,
          vehiculoId: 2,
          mecanicoId: 1,
          tallerId: 1,
        },
      },
    },
  })
  create(@Body() dto: CreateMantenimientoDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar las órdenes de mantenimiento' })
  @Roles(Rol.ADMIN)
  findAll() {
    return this.service.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'Consultar los mantenimientos activos' })
  @Roles(Rol.ADMIN)
  findActive() {
    return this.service.findActive();
  }

  @Get('my')
  @ApiOperation({ summary: 'Consultar los mantenimientos asignados al técnico autenticado' })
  @Roles(Rol.TECHNICIAN)
  findMine(@CurrentUser('id') userId: number) {
    return this.service.findMine(userId);
  }

  @Get('vehiculo/:vehiculoId')
  @ApiOperation({ summary: 'Consultar los mantenimientos de un vehículo' })
  @Roles(Rol.ADMIN)
  findByVehicle(@Param('vehicleId', ParseIntPipe) vehiculoId: number) {
    return this.service.findByVehicle(vehiculoId);
  }

  @Get('vehiculo/:vehiculoId/historial')
  @ApiOperation({ summary: 'Consultar el historial de mantenimiento de un vehículo' })
  @Roles(Rol.ADMIN)
  history(@Param('vehiculoId', ParseIntPipe) vehiculoId: number) {
    return this.service.findHistoryByVehicle(vehiculoId);
  }

  @Get('mecanico/:mecanicoId')
  @ApiOperation({ summary: 'Consultar los mantenimientos de un mecánico' })
  @Roles(Rol.ADMIN)
  findByMechanic(@Param('mecanicoId', ParseIntPipe) mecanicoId: number) {
    return this.service.findByMechanic(mecanicoId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consultar una orden de mantenimiento por su identificador' })
  @Roles(Rol.ADMIN, Rol.TECHNICIAN)
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthUser,
  ) {
    return this.service.findOne(id, user);
  }

  @Patch(':id/estado')
  @ApiOperation({ summary: 'Actualizar the estado de una orden de mantenimiento' })
  @Roles(Rol.ADMIN, Rol.TECHNICIAN)
  @ApiBody({
    type: UpdateEstadoMantenimientoDto,
    description: 'Datos para actualizar el estado de la orden de mantenimiento',
    examples: {
      inProgress: {
        summary: 'Iniciar mantenimiento',
        value: {
          estado: 'IN_PROGRESS',
        },
      },
      completed: {
        summary: 'Finalizar mantenimiento',
        value: {
          estado: 'COMPLETED',
          trabajoRealizado: 'Cambio de aceite, filtro de aceite y filtro de aire',
          costoFinal: 350000,
          finishedAt: '2026-10-28T10:30:00.000Z',
          kilometrajeFinal: 45200,
        },
      },
      cancelled: {
        summary: 'Cancelar mantenimiento',
        value: {
          estado: 'CANCELLED',
        },
      },
    },
  })
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEstadoMantenimientoDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.service.updateStatus(id, dto, user);
  }
}

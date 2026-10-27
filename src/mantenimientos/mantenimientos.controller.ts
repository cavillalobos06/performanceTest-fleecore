import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  AuthUser,
  CurrentUser,
} from '../common/decorators/current-user.decorator.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { Rol } from '../common/enum.js';
import { CreateMantenimientoDto } from './dto/create-mantenimiento.dto.js';
import { UpdateEstadoMantenimientoDto } from './dto/update-mantenimiento.dto.js';
import { MantenimientosService } from './mantenimientos.service.js';

@ApiTags('mantenimientos')
@ApiBearerAuth()
@Controller('mantenimientos')
export class MantenimientosController {
  constructor(private readonly service: MantenimientosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una orden de mantenimiento' })
  @Roles(Rol.ADMIN)
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
  @ApiOperation({ summary: 'Actualizar el estado de una orden de mantenimiento' })
  @Roles(Rol.ADMIN, Rol.TECHNICIAN)
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEstadoMantenimientoDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.service.updateStatus(id, dto, user);
  }
}

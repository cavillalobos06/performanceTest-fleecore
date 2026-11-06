import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles.decorator.js';
import { Rol } from '../common/enum.js';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto.js';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto.js';
import { VehiculosService } from './vehiculos.service.js';

@ApiTags('vehiculos')
@ApiBearerAuth()
@Controller('vehiculos')
export class VehiculosController {
  constructor(private readonly service: VehiculosService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar un vehículo' })
  @Roles(Rol.ADMIN)
  create(@Body() dto: CreateVehiculoDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar los vehículos' })
  @Roles(Rol.ADMIN, Rol.TECHNICIAN)
  findAll() {
    return this.service.findAll();
  }

  @Get('inactivos')
  @ApiOperation({ summary: 'Listar vehículos inactivos' })
  @Roles(Rol.ADMIN)
  findInactive() {
    return this.service.findInactive();
  }

  @Get('placa/:placa')
  @ApiOperation({ summary: 'Buscar a vehículos por placa' })
  @Roles(Rol.ADMIN, Rol.TECHNICIAN)
  findByPlate(@Param('placa') placa: string) {
    return this.service.findByPlate(placa);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consultar un vehículo por su identificador' })
  @Roles(Rol.ADMIN, Rol.TECHNICIAN)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar los datos de un vehículo' })
  @Roles(Rol.ADMIN)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateVehiculoDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un vehículo' })
  @Roles(Rol.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}

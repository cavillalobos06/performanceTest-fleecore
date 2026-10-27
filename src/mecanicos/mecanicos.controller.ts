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
import { Roles } from '../common/decorators/roles.decorator.js';
import { Rol } from '../common/enum.js';
import { CreateMecanicoDto } from './dto/create-mecanico.dto.js'
import { UpdateMecanicoDto } from './dto/update-mecanico.dto.js';
import { MecanicosService } from './mecanicos.service.js';

@ApiTags('mecanicos')
@ApiBearerAuth()
@Controller('mecanicos')
export class MecanicosController {
  constructor(private readonly service: MecanicosService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar un mecánico' })
  @Roles(Rol.ADMIN)
  create(@Body() dto: CreateMecanicoDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar los mecánicos' })
  @Roles(Rol.ADMIN)
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consultar un mecánico por su identificador' })
  @Roles(Rol.ADMIN)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar los datos de un mecánico' })
  @Roles(Rol.ADMIN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMecanicoDto,
  ) {
    return this.service.update(id, dto);
  }

  @Patch(':id/activate')
  @ApiOperation({ summary: 'Activar un mecánico' })
  @Roles(Rol.ADMIN)
  activate(@Param('id', ParseIntPipe) id: number) {
    return this.service.setActive(id, true);
  }

  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Desactivar un mecánico' })
  @Roles(Rol.ADMIN)
  deactivate(@Param('id', ParseIntPipe) id: number) {
    return this.service.setActive(id, false);
  }
}

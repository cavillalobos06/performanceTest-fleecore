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
import { CreateTallerDto } from './dto/create-taller.dto.js';
import { UpdateTallerDto } from './dto/update-taller.dto.js';
import { TalleresService } from './talleres.service.js';

@ApiTags('talleres')
@ApiBearerAuth()
@Controller('talleres')
export class TalleresController {
  constructor(private readonly service: TalleresService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar un taller' })
  @Roles(Rol.ADMIN)
  create(@Body() dto: CreateTallerDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar los talleres activos' })
  @Roles(Rol.ADMIN, Rol.TECHNICIAN)
  findActive() {
    return this.service.findActive();
  }

  @Get('all')
  @ApiOperation({ summary: 'Listar todos los talleres' })
  @Roles(Rol.ADMIN)
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consultar un taller por su identificador' })
  @Roles(Rol.ADMIN, Rol.TECHNICIAN)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar los datos de un taller' })
  @Roles(Rol.ADMIN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTallerDto,
  ) {
    return this.service.update(id, dto);
  }

  @Patch(':id/activar')
  @ApiOperation({ summary: 'Activar un taller' })
  @Roles(Rol.ADMIN)
  activate(@Param('id', ParseIntPipe) id: number) {
    return this.service.setActive(id, true);
  }

  @Patch(':id/desactivar')
  @ApiOperation({ summary: 'Desactivar un taller' })
  @Roles(Rol.ADMIN)
  deactivate(@Param('id', ParseIntPipe) id: number) {
    return this.service.setActive(id, false);
  }
}

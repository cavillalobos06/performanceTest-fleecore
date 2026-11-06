import { PartialType } from '@nestjs/swagger';
import { CreateVehiculoDto } from './create-vehiculo.dto.js';

export class UpdateVehiculoDto extends PartialType(CreateVehiculoDto) {}

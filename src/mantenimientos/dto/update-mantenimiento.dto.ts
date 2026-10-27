import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { EstadoMantenimiento } from '../../common/enum.js';

export class UpdateEstadoMantenimientoDto {
  
  @IsEnum(EstadoMantenimiento)
  estado: EstadoMantenimiento;

  @IsOptional()
  @IsString()
  trabajoRealizado?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  costoFinal?: number;

  @IsOptional()
  @IsDateString()
  finishedAt?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  kilometrajeFinal?: number;
}

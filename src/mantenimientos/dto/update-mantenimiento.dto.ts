import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    description: 'Nuevo estado de la orden de mantenimiento',
    enum: EstadoMantenimiento,
    enumName: 'EstadoMantenimiento',
    example: EstadoMantenimiento.IN_PROGRESS,
  })
  @IsEnum(EstadoMantenimiento)
  estado: EstadoMantenimiento;

  @ApiProperty({
    description: 'Descripción detallada del trabajo realizado',
    example: 'Se cambió aceite, filtro de aceite y filtro de aire',
    required: false,
  })
  @IsOptional()
  @IsString()
  trabajoRealizado?: string;

  @ApiProperty({
    description: 'Costo final del servicio',
    example: 350000,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  costoFinal?: number;

  @ApiProperty({
    description: 'Fecha y hora de finalización en formato ISO 8601',
    example: '2026-10-28T10:30:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  finishedAt?: string;

  @ApiProperty({
    description: 'Kilometraje final del vehículo tras el servicio',
    example: 45200,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  kilometrajeFinal?: number;
}

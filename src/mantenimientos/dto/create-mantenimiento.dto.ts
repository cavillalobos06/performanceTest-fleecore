import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { TipoMantenimiento } from '../../common/enum.js';

export class CreateMantenimientoDto {
  @ApiProperty({
    description: 'Tipo de mantenimiento a realizar (PREVENTIVE o CORRECTIVE)',
    enum: TipoMantenimiento,
    enumName: 'TipoMantenimiento',
    example: TipoMantenimiento.PREVENTIVE,
  })
  @IsEnum(TipoMantenimiento)
  tipo: TipoMantenimiento;

  @ApiProperty({
    description:
      'Detalle o descripción de los trabajos específicos que se van a ejecutar',
    example: 'Cambio de aceite y filtros de aire',
  })
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @ApiProperty({
    description:
      'Kilometraje actual del vehículo al momento de programar el mantenimiento',
    example: 45000,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  kilometraje: number;

  @ApiProperty({
    description:
      'Fecha y hora estimada en formato ISO 8601 para el inicio del servicio',
    example: '2026-10-28T08:00:00.000Z',
  })
  @IsDateString()
  fechaProgramada: string;

  @ApiProperty({
    description:
      'Duración estimada del trabajo expresada en minutos (mínimo 15 minutos)',
    example: 120,
    minimum: 15,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(15)
  duracionMinutos?: number;

  @ApiProperty({
    description: 'ID único del vehículo associated to the maintenance',
    example: 1,
  })
  @IsInt()
  vehiculoId: number;

  @ApiProperty({
    description: 'ID del mecánico assigned to perform the work',
    example: 3,
  })
  @IsInt()
  mecanicoId: number;

  @ApiProperty({
    description: 'ID del taller mecánico where the service will be carried out',
    example: 2,
  })
  @IsInt()
  tallerId: number;
}

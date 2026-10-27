import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { EstadoVehiculo } from '../../common/enum.js';

export class CreateVehiculoDto {
  @ApiProperty({
    description:
      'Placa única del vehículo (se transformará automáticamente a mayúsculas y sin espacios)',
    example: 'ABC123',
  })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toUpperCase() : value,
  )
  @IsString()
  @IsNotEmpty()
  placa: string;

  @ApiProperty({
    description: 'Marca del fabricante del vehículo',
    example: 'Chevrolet',
  })
  @IsString()
  @IsNotEmpty()
  marca: string;

  @ApiProperty({
    description: 'Modelo o línea del vehículo',
    example: 'NPR',
  })
  @IsString()
  @IsNotEmpty()
  modelo: string;

  @ApiProperty({
    description:
      'Año de fabricación del vehículo (permitido entre 1950 y 2100)',
    example: 2022,
    minimum: 1950,
    maximum: 2100,
  })
  @IsInt()
  @Min(1950)
  @Max(2100)
  año: number;

  @ApiProperty({
    description: 'Kilometraje actual acumulado del vehículo',
    example: 45000,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  kilometraje: number;

  /** Solo AVAILABLE o INACTIVE; IN_MAINTENANCE lo controla el sistema */
  @ApiProperty({
    description:
      'Estado inicial del vehículo (Solo se permite AVAILABLE o INACTIVE)',
    enum: EstadoVehiculo,
    enumName: 'EstadoVehiculo',
    example: EstadoVehiculo.AVAILABLE,
    required: false,
  })
  @IsOptional()
  @IsIn([EstadoVehiculo.AVAILABLE, EstadoVehiculo.INACTIVE])
  status?: EstadoVehiculo;
}

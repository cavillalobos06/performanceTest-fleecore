import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateMecanicoDto {
  @ApiProperty({
    description: 'Nombre completo del mecánico',
    example: 'Carlos Pérez',
  })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({
    description: 'Correo electrónico de contacto del mecánico',
    example: 'carlos.perez@fleetcore.com',
  })
  @IsEmail()
  correo: string;

  @ApiProperty({
    description: 'Área de especialización técnica del mecánico',
    example: 'Motor y transmisión',
  })
  @IsString()
  @IsNotEmpty()
  especialidad: string;

  @ApiProperty({
    description: 'Estado de disponibilidad del mecánico en el sistema',
    example: true,
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    description: 'ID del usuario del sistema asociado al mecánico (si aplica)',
    example: 2,
    required: false,
  })
  @IsOptional()
  @IsInt()
  userId?: number;
}

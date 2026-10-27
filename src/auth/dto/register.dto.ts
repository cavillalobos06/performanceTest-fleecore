import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { Rol } from '../../common/enum.js';

export class RegisterDto {
  @ApiProperty({
    description: 'Nombre completo del nuevo usuario',
    example: 'Juan Pérez',
  })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({
    description:
      'Dirección de correo electrónico institucional o personal para iniciar sesión',
    example: 'juan.perez@fleetcore.com',
  })
  @IsEmail()
  correo: string;

  @ApiProperty({
    description:
      'Contraseña segura para la cuenta (debe contener un mínimo de 8 caracteres)',
    example: 'ClaveSegura123*',
    minLength: 8,
  })
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener mínimo 8 caracteres' })
  contraseña: string;

  @ApiProperty({
    description:
      'Rol o nivel de acceso asignado al usuario dentro de la plataforma',
    enum: Rol,
    enumName: 'Rol',
    example: Rol.ADMIN,
  })
  @IsEnum(Rol)
  rol: Rol;
}

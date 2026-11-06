import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Correo electrónico registrado del usuario',
    example: 'admin@fleetcore.com',
  })
  @IsEmail()
  correo: string;

  @ApiProperty({
    description: 'Contraseña de la cuenta para validar el acceso',
    example: 'Admin123*',
  })
  @IsString()
  @IsNotEmpty()
  contraseña: string;
}

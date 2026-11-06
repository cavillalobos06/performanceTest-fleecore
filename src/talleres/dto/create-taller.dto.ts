import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateTallerDto {
  @ApiProperty({
    description: 'Nombre único que identifica al taller mecánico',
    example: 'Taller Centro',
  })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({
    description: 'Dirección física completa donde se ubica el taller',
    example: 'Calle 10 # 5-20, Centro',
  })
  @IsString()
  @IsNotEmpty()
  direccion: string;

  @ApiProperty({
    description:
      'Indica si el taller se encuentra operativo y disponible para asignaciones',
    example: true,
  })
  @IsBoolean()
  activo: boolean;
}

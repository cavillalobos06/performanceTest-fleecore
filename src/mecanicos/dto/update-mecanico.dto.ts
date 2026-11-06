import { PartialType } from '@nestjs/swagger';
import { CreateMecanicoDto } from './create-mecanico.dto.js';

export class UpdateMecanicoDto extends PartialType(CreateMecanicoDto) {}

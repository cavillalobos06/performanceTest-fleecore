import { PartialType } from '@nestjs/swagger';
import { CreateTallerDto } from './create-taller.dto.js';

export class UpdateTallerDto extends PartialType(CreateTallerDto) {}

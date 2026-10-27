import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TalleresController } from './talleres.controller.js';
import { TalleresService } from './talleres.service.js';
import { Taller } from './entities/taller.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Taller])],
  controllers: [TalleresController],
  providers: [TalleresService],
})
export class TalleresModule {}

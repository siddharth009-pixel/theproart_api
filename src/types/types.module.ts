import { Module } from '@nestjs/common';
import { TypesService } from './types.service';
import { TypesController } from './types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeT } from './entities/type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TypeT])],
  controllers: [TypesController],
  providers: [TypesService],
})
export class TypesModule {}

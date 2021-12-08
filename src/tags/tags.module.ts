import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagT } from './entities/tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TagT])],
  controllers: [TagsController],
  providers: [TagsService],
})
export class TagsModule {}

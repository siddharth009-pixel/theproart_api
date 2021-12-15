import { Module } from '@nestjs/common';
import { AttributesService } from './attributes.service';
import { AttributesController } from './attributes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttributeT } from './entities/attribute.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AttributeT])],
  controllers: [AttributesController],
  providers: [AttributesService],
})
export class AttributesModule {}

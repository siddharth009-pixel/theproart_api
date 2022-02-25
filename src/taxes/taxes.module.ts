import { Module } from '@nestjs/common';
import { TaxesService } from './taxes.service';
import { TaxesController } from './taxes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaxT } from './entities/tax.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TaxT])],
  controllers: [TaxesController],
  providers: [TaxesService],
})
export class TaxesModule {}

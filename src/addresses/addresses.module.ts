import { Module } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { AddressesController } from './addresses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressT } from './entities/address.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AddressT])],
  controllers: [AddressesController],
  providers: [AddressesService],
})
export class AddressesModule {}

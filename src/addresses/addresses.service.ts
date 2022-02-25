import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { AddressT } from './entities/address.entity';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(AddressT) private addressReository: Repository<AddressT>,
  ) {}

  create(createAddressDto: CreateAddressDto) {
    return 'This action adds a new address';
  }

  findAll() {
    return `This action returns all addresses`;
  }

  findOne(id: number) {
    return `This action returns a #${id} address`;
  }

  update(id: number, updateAddressDto: UpdateAddressDto) {
    return `This action updates a #${id} address`;
  }

  async remove(id: number) {
    const address = await this.addressReository.findOne({ id: id });
    return await this.addressReository.delete(address);
  }
}

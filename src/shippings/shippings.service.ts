import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateShippingDto } from './dto/create-shipping.dto';
import { GetShippingsDto } from './dto/get-shippings.dto';
import { UpdateShippingDto } from './dto/update-shipping.dto';
import { ShippingT } from './entities/shipping.entity';

@Injectable()
export class ShippingsService {
  constructor(
    @InjectRepository(ShippingT)
    private shippintRepository: Repository<ShippingT>,
  ) {}

  async create(createShippingDto: CreateShippingDto) {
    return await this.shippintRepository.save(createShippingDto);
  }

  getShippings({}: GetShippingsDto) {
    const shippings = this.shippintRepository.find();
    return shippings;
  }

  async findOne(id: number) {
    const shipping = await this.shippintRepository.findOne(id);
    return shipping;
  }

  async update(id: number, updateShippingDto: UpdateShippingDto) {
    console.log(updateShippingDto);
    console.log(id);
    if (typeof id != 'number') {
      return;
    }
    const shipping = await this.shippintRepository.findOne(id);
    if (shipping) return this.shippintRepository.update(id, updateShippingDto);
  }

  async remove(id: number) {
    console.log(id);
    console.log('remove');
    const shipping = await this.shippintRepository.findOne(id);
    if (shipping) return this.shippintRepository.remove(shipping);
  }
}

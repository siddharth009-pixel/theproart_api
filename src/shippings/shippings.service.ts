import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
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
    if (shipping) return this.shippintRepository.remove(shipping);
    else
      return {
        code: '400',
        message: 'Shiping is not Present',
      };
  }

  async update(id: number, updateShippingDto: UpdateShippingDto) {
    Logger.log(id);

    const shipping = await this.shippintRepository.findOne(id);
    if (shipping) return this.shippintRepository.update(id, updateShippingDto);
    else
      return {
        code: '400',
        message: 'Shiping is not Present',
      };
  }

  async remove(id: number) {
    const shipping = await this.shippintRepository.findOne(id);
    Logger.log(shipping, 'Shipping');
    if (shipping) return this.shippintRepository.remove(shipping);
    else
      return {
        code: '400',
        message: 'Shiping is not Present',
      };
  }
}

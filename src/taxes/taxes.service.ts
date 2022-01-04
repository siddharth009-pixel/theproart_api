import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Repository } from 'typeorm';
import { CreateTaxDto } from './dto/create-tax.dto';
import { UpdateTaxDto } from './dto/update-tax.dto';
import { Tax, TaxT } from './entities/tax.entity';
@Injectable()
export class TaxesService {
  constructor(
    @InjectRepository(TaxT) private taxeRepository: Repository<TaxT>,
  ) {}

  create(createTaxDto: CreateTaxDto) {
    return this.taxeRepository.save(createTaxDto);
  }

  findAll() {
    return this.taxeRepository.find();
  }

  findOne(id: number) {
    return this.taxeRepository.findOne(id);
  }

  update(id: number, updateTaxDto: UpdateTaxDto) {
    return this.taxeRepository.update(id, updateTaxDto);
  }

  async remove(id: number) {
    const tax = await this.taxeRepository.findOne(id);
    this.taxeRepository.delete(tax);
  }
}

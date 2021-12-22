import { Injectable } from '@nestjs/common';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import attributesJson from './attributes.json';
import { Attribute, AttributeT } from './entities/attribute.entity';
import { plainToClass } from 'class-transformer';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';
import { AttributeValueT } from './entities/attribute-value.entity';
import { ShopT } from 'src/shops/entities/shop.entity';
import { shop_cover } from 'src/common/entities/attachment.entity';

const attributes = plainToClass(Attribute, attributesJson);
@Injectable()
export class AttributesService {
  private attributes: Attribute[] = attributes;

  constructor(
    @InjectRepository(AttributeT)
    private attributeRepositor: Repository<AttributeT>,
  ) {}

  attributeValueRepository = getRepository(AttributeValueT);
  shopRepository = getRepository(ShopT);

  async create(createAttributeDto: CreateAttributeDto) {
    const attribute = new AttributeT();
    attribute.name = createAttributeDto?.name;
    attribute.slug = createAttributeDto?.name + 'slug';
    attribute.shop_id = createAttributeDto?.shop_id;
    const shop = await this.shopRepository.findOne({
      id: createAttributeDto?.shop_id,
    });
    attribute.shop = shop;
    await this.attributeRepositor.save(attribute);

    createAttributeDto?.values.map(async (value) => {
      await this.attributeValueRepository.save({
        ...value,
        shop_id: createAttributeDto?.shop_id,
        attribute: attribute,
      });
    });
  }

  async findAll() {
    return await this.attributeRepositor.find();
  }

  async findOne(id: number) {
    return await this.attributeRepositor.findOne(id);
  }

  update(id: number, updateAttributeDto: UpdateAttributeDto) {
    return this.attributes[0];
  }

  async remove(id: number) {
    const attribute = await this.attributeRepositor.findOne(id);
    await this.attributeRepositor
      .softDelete(attribute)
      .catch((err) => console.log(err));
    return 1;
  }
}

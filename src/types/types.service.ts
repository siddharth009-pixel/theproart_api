import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { Type, TypeT } from './entities/type.entity';

import typesJson from './types.json';
import Fuse from 'fuse.js';
import { GetTypesDto } from './dto/get-types.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';
import { BannerT } from 'src/common/entities/banner.entity';
import {
  BannerAttachment,
  PromotionalSliders,
  TypeAttachment,
} from 'src/common/entities/attachment.entity';
import { TypeSettingsT } from 'src/common/entities/typesettings.entity';

const types = plainToClass(Type, typesJson);
const options = {
  keys: ['name'],
  threshold: 0.3,
};
@Injectable()
export class TypesService {
  private types: Type[] = types;
  constructor(
    @InjectRepository(TypeT) private typeRepository: Repository<TypeT>,
  ) {}

  bannerRepository = getRepository(BannerT);
  bannerAttachementRepository = getRepository(BannerAttachment);
  settingRepository = getRepository(TypeSettingsT);
  typeAttachmentRepository = getRepository(TypeAttachment);
  promotionalSlidersRepository = getRepository(PromotionalSliders);

  async getTypes({ text }: GetTypesDto) {
    let data: TypeT[] = await this.typeRepository.find();
    const fuse = new Fuse(data, options);
    if (text?.replace(/%/g, '')) {
      data = fuse.search(text)?.map(({ item }) => item);
    }
    return data;
  }

  async getTypeBySlug(slug: string) {
    return await this.typeRepository.findOne({ slug: slug });
  }

  async create(createTypeDto: CreateTypeDto) {
    const type = new TypeT();
    type.name = createTypeDto?.name;
    type.icon = createTypeDto?.icon;
    type.slug = createTypeDto?.name + 'slug';
    //saving into setting repository
    if (createTypeDto?.settings) {
      const setting = await this.settingRepository.save({
        ...createTypeDto.settings,
      });
      type.settings = setting;
    }
    //save sliders
    if (createTypeDto?.promotional_sliders) {
      createTypeDto?.promotional_sliders.map(async (slide) => {
        delete slide.id;
        const slideDatabasde = await this.promotionalSlidersRepository.save({
          ...slide,
        });
        type.promotional_sliders = [slideDatabasde];
      });
    }
    //save banner
    if (createTypeDto?.banners) {
      const bannerArray: BannerT[] = [];
      createTypeDto?.banners.map(async (banner) => {
        delete banner.image;
        const bannerDb = await this.bannerRepository.save({
          ...banner,
        });
        bannerArray.push(bannerDb);
      });
      type.banners = bannerArray;
    }
    return await this.typeRepository.save(type);
  }

  async findAll() {
    return await this.typeRepository.find();
  }

  async findOne(id: number) {
    return await this.typeRepository.findOne(id);
  }

  update(id: number, updateTypeDto: UpdateTypeDto) {
    return this.types[0];
  }

  async remove(id: number) {
    const type = await this.typeRepository.findOne(id);
    return await this.typeRepository.remove(type);
  }
}

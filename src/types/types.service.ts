import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { Type, TypeT } from './entities/type.entity';

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

const options = {
  keys: ['name'],
  threshold: 0.3,
};
@Injectable()
export class TypesService {
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
    await this.typeRepository.save(type);
    //save sliders
    if (createTypeDto?.promotional_sliders) {
      createTypeDto?.promotional_sliders.map(async (slide) => {
        delete slide.id;
        const slider = await this.promotionalSlidersRepository.save({
          ...slide,
        });
        this.promotionalSlidersRepository.update(
          { id: slider.id },
          {
            typep: type,
          },
        );
      });
    }
    //save banner
    if (createTypeDto?.banners) {
      createTypeDto?.banners.map(async (banner) => {
        delete banner.image;
        const bannerdb = await this.bannerRepository.save({
          ...banner,
        });
        this.bannerRepository.update(
          { id: bannerdb.id },
          {
            type: type,
          },
        );
      });
    }
    return type;
  }

  async findAll() {
    return await this.typeRepository.find();
  }

  async findOne(id: number) {
    return await this.typeRepository.findOne(id);
  }

  update(id: number, updateTypeDto: UpdateTypeDto) {
    return id;
  }

  async remove(id: number) {
    const type = await this.typeRepository.findOne(id);
    return await this.typeRepository.remove(type);
  }
}

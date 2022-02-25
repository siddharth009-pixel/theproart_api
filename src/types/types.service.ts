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
  ) { }

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
    const date=new Date();
    type.created_at=date;
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
        delete banner?.image?.id;
        const banner_attachment = await this.bannerAttachementRepository.save({
          ...banner.image
        });
        delete banner.image;
        const bannerdb = await this.bannerRepository.save({
          ...banner,
          image:banner_attachment,
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

  async update(id: number, updateTypeDto: UpdateTypeDto) {

    const type = await this.typeRepository.findOne(id);
    type.name = updateTypeDto?.name;
    type.icon = updateTypeDto?.icon;
    type.slug = updateTypeDto?.name + 'slug';

    //saving into setting repository
    if (updateTypeDto?.settings) {
      const setting = await this.settingRepository.findOne({ type: type })
      await this.settingRepository.update(setting.id, {
        ...updateTypeDto.settings
      })
      type.settings = setting;
    }
    await this.typeRepository.save(type);

    //update sliders
    if(updateTypeDto?.promotional_sliders){
      const oldSliders=await this.promotionalSlidersRepository.find({ typep: type })
      oldSliders.map(async slider=>{
        await this.promotionalSlidersRepository.remove(slider)
      })
      updateTypeDto?.promotional_sliders.map(async slider=>{
        const newSlider = await this.promotionalSlidersRepository.save({ 
          ...slider,
          typep: type
        })
        await this.promotionalSlidersRepository.update(
          { id: newSlider.id },
          {
            typep: type,
          },
        );
      })
    }
    await this.typeRepository.save(type);

    //save banner
    if (updateTypeDto?.banners) {

      const oldBanners = await this.bannerRepository.find({ type: type })
      oldBanners.map(async banner => {
        await this.bannerRepository.remove(banner)
      })

      updateTypeDto?.banners.map(async (banner) => {
        console.log('banners', updateTypeDto?.banners);
        delete banner?.image?.id;
        const banner_attachment = await this.bannerAttachementRepository.save({
          ...banner.image,
        });
        delete banner.image;
        const bannerdb = await this.bannerRepository.save({
          ...banner,
          image: banner_attachment,
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

  async remove(id: number) {
    const type = await this.typeRepository.findOne(id);
    return await this.typeRepository.remove(type);
  }
}

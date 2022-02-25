import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TagAttachment } from 'src/common/entities/attachment.entity';
import { paginate } from 'src/common/pagination/paginate';
import { TypeT } from 'src/types/entities/type.entity';
import { getRepository, Repository } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';
import { GetTagsDto } from './dto/get-tags.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag, TagT } from './entities/tag.entity';

@Injectable()
export class TagsService {
  private tags: Tag[] = [];

  constructor(
    @InjectRepository(TagT) private tagsRepository: Repository<TagT>,
  ) {}

  tagRepository = getRepository(TagAttachment);
  typeRepository = getRepository(TypeT);
  async create(createTagDto: CreateTagDto) {
    const tag = new TagT();

    if (createTagDto?.image) {
      if (createTagDto?.image.id) {
        delete createTagDto.image.id;
      }
      const image = await this.tagRepository.save({
        ...createTagDto.image,
      });
      tag.image = image;
    }
    const type = await this.typeRepository.findOne({
      id: +createTagDto?.type_id,
    });

    tag.details = createTagDto?.details;
    tag.name = createTagDto?.name;
    tag.type = type;
    tag.icon = createTagDto?.icon;
    tag.slug = createTagDto?.name + 'slug';
    const date = new Date();
    tag.created_at=date;
    return this.tagsRepository.save(tag);
  }

  async findAll({ page, limit }: GetTagsDto) {
    if (!page) page = 1;
    const url = `/tags?limit=${limit}`;
    const count = await this.tagsRepository.count();
    const tagData = await this.tagsRepository.find();
    return {
      data: tagData,
      ...paginate(count, page, limit, count, url),
    };
  }

  findOne(id: number) {
    return this.tagsRepository.findOne(id);
  }

  update(id: number, updateTagDto: UpdateTagDto) {
    return this.tagsRepository.update(id, updateTagDto);
  }

  async remove(id: number) {
    const tag = await this.tagsRepository.findOne(id);
    return this.tagsRepository.delete(tag);
  }
}

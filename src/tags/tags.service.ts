import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate } from 'src/common/pagination/paginate';
import { Repository } from 'typeorm';
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

  create(createTagDto: CreateTagDto) {
    return this.tagsRepository.save(createTagDto);
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

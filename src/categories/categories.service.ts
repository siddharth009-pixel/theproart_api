import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { GetCategoriesDto } from './dto/get-categories.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryT } from './entities/category.entity';
import Fuse from 'fuse.js';
import { paginate } from 'src/common/pagination/paginate';
import { GetCategoriesAlongChildrenDto } from './dto/get-categories-along-children.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';
import { CategoriAttachment } from 'src/common/entities/attachment.entity';
import { TypeT } from 'src/types/entities/type.entity';
const options = {
  keys: ['name', 'type.slug'],
  threshold: 0.3,
};
@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryT)
    private categoryRepository: Repository<CategoryT>,
  ) {}

  categoryImage = getRepository(CategoriAttachment);
  typeRepository = getRepository(TypeT);

  async create(createCategoryDto: CreateCategoryDto) {
    const category = new CategoryT();
    if (createCategoryDto?.image) {
      const image = await this.categoryImage.save({
        ...createCategoryDto.image,
      });
      category.image = image;
    }
    category.details = createCategoryDto?.details;
    category.icon = createCategoryDto?.icon;
    category.name = createCategoryDto?.name;
    category.slug = createCategoryDto?.name + 'slug';

    const type = await this.typeRepository.findOne({
      id: +createCategoryDto?.type_id,
    });
    category.type = type;
    return await this.categoryRepository.save(category);
  }

  async getCategories({ limit, page, search }: GetCategoriesDto) {
    if (!page) page = 1;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    let data: CategoryT[] = await this.categoryRepository.find();
    const fuse = new Fuse(data, options);
    if (search) {
      const parseSearchParams = search.split(';');
      for (const searchParam of parseSearchParams) {
        const [key, value] = searchParam.split(':');
        data = data.filter((item) => item[key] === value);
        data = fuse.search(value)?.map(({ item }) => item);
      }
    }
    const results = data.slice(startIndex, endIndex);
    const url = `/categories?search=${search}&limit=${limit}`;
    return {
      data: results,
      ...paginate(data.length, page, limit, results.length, url),
    };
  }

  // getCategoriesAlongChildren(
  //   values: GetCategoriesAlongChildrenDto,
  // ): Category[] {
  //   console.log(values, 'values');
  //   return this.categories;
  // }

  async getCategory(id: number) {
    const c = await this.categoryRepository.findOne(id);
    return c;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return;
  }

  async remove(id: number) {
    const category = await this.categoryRepository.findOne(id);
    return await this.categoryRepository.remove(category);
  }
}

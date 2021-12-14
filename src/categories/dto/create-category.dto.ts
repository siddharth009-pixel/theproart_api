import { PickType } from '@nestjs/swagger';
import { Category } from '../entities/category.entity';

export class CreateCategoryDto extends PickType(Category, [
  'name',
  'details',
  'parent',
  'icon',
  'image',
]) {
  type_id: number;
}

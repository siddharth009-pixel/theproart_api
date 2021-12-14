import { PickType } from '@nestjs/swagger';
import { TagT } from '../entities/tag.entity';

export class CreateTagDto extends PickType(TagT, [
  'name',
  'details',
  'image',
  'icon',
]) {
  type_id: string;
}

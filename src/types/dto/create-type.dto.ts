import { PickType } from '@nestjs/swagger';
import { Attachment } from 'src/common/entities/attachment.entity';
import { Banner, Type, TypeSettings } from '../entities/type.entity';

export class CreateTypeDto extends PickType(Type, [
  'name',
  'icon',
  'settings',
]) {
  banners?: Banner[];
  promotional_sliders?: Attachment[];
  settings?: TypeSettings;
}

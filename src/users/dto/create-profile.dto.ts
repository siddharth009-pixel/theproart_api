import { PickType } from '@nestjs/swagger';
import { Profile, ProfileT } from '../entities/profile.entity';

export class CreateProfileDto extends PickType(ProfileT, [
  'avatar',
  'bio',
  'socials',
  'contact',
  'customer',
]) {}

export class ConnectBelongsTo {
  connect: number;
}

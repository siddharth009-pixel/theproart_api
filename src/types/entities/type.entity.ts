import { Attachment, AttachmentT } from 'src/common/entities/attachment.entity';
import { CoreEntity, CoreEntityT } from 'src/common/entities/core.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export class Type extends CoreEntity {
  name: string;
  slug: string;
  image: Attachment;
  icon: string;
  banners?: Banner[];
  promotional_sliders?: Attachment[];
  settings?: TypeSettings;
}

export class Banner {
  id: number;
  title?: string;
  description?: string;
  image: Attachment;
}

export class TypeSettings {
  isHome: boolean;
  layoutType: string;
  productCard: string;
}

@Entity('Banner')
export class BannerT {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title?: string;

  @Column()
  description?: string;

  @OneToOne(() => AttachmentT, (atta) => atta.id)
  image: AttachmentT;
}

@Entity('TypeSettings')
export class TypeSettingsT {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  isHome: boolean;
  @Column()
  layoutType: string;
  @Column()
  productCard: string;
}

@Entity('Type')
export class TypeT extends CoreEntityT {
  @Column()
  name: string;

  @Column()
  slug: string;

  @OneToOne(() => AttachmentT, (atta) => atta.id)
  image: AttachmentT;

  @Column()
  icon: string;

  @OneToMany(() => BannerT, (banner) => banner.id)
  banners?: BannerT[];

  @OneToMany(() => AttachmentT, (atta) => atta.id)
  promotional_sliders?: AttachmentT[];

  @OneToOne(() => TypeSettingsT, (typesetting) => typesetting.id)
  settings?: TypeSettingsT;
}

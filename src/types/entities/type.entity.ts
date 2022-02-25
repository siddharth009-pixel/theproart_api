import {
  Attachment,
  PromotionalSliders,
  TypeAttachment,
} from 'src/common/entities/attachment.entity';
import { TypeSettingsT } from 'src/common/entities/typesettings.entity';
import { CoreEntity, CoreEntityT } from 'src/common/entities/core.entity';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { BannerT } from 'src/common/entities/banner.entity';
import { TagT } from 'src/tags/entities/tag.entity';

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

@Entity('Type')
export class TypeT extends CoreEntityT {
  @Column()
  name: string;

  @Column({ nullable: true })
  slug: string;

  @OneToOne(() => TypeAttachment, (atta) => atta.type, {
    eager: true,
    nullable: true,
  })
  image: TypeAttachment;

  @Column({ nullable: true })
  icon: string;

  @OneToMany(() => TagT, (tag) => tag.type, {
    nullable: true,
  })
  tag: TagT[];

  @OneToMany(() => BannerT, (banner) => banner.type, {
    eager: true,
    nullable: true,
  })
  banners: BannerT[];

  @OneToMany(() => PromotionalSliders, (atta) => atta.typep, {
    eager: true,
    nullable: true,
  })
  promotional_sliders: PromotionalSliders[];

  @OneToOne(() => TypeSettingsT, (typesetting) => typesetting.type, {
    eager: true,
    nullable: true,
  })
  settings: TypeSettingsT;
}

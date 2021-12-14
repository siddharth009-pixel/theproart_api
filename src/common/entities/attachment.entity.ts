import { CategoryT } from 'src/categories/entities/category.entity';
import { CoreEntity, CoreEntityT } from 'src/common/entities/core.entity';
import { CouponT } from 'src/coupons/entities/coupon.entity';
import { ShopT } from 'src/shops/entities/shop.entity';
import { TagT } from 'src/tags/entities/tag.entity';
import { TypeT } from 'src/types/entities/type.entity';
import { ProfileT } from 'src/users/entities/profile.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BalanceT } from './balance.entity';
import { BannerT } from './banner.entity';

export class Attachment extends CoreEntity {
  thumbnail?: string;
  original?: string;
}

@Entity('Attachment')
export class AttachmentT extends CoreEntityT {
  @Column({ nullable: true })
  thumbnail?: string;
  @Column({ nullable: true })
  original?: string;
}

@Entity('ProfileAttachment')
export class ProfileAttachment extends AttachmentT {
  @OneToOne(() => ProfileT, (profile: ProfileT) => profile.avatar, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  profile: ProfileT;
}
@Entity('BannerAttachment')
export class BannerAttachment extends AttachmentT {
  @OneToOne(() => BannerT, (banner: BannerT) => banner.image, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  banner: BannerT;
}

@Entity('TypeAttachment')
export class TypeAttachment extends AttachmentT {
  @OneToOne(() => TypeT, (tag: TypeT) => tag.image, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  type: TypeT;
}

@Entity('PromotionalSliders')
export class PromotionalSliders extends AttachmentT {
  @ManyToOne(() => TypeT, (tag: TypeT) => tag.promotional_sliders, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  typep: TypeT;
}
@Entity('TagAttachment')
export class TagAttachment extends AttachmentT {
  @OneToOne(() => TagT, (tag: TagT) => tag.image, {
    cascade: true,
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  tag: TagT;
}
@Entity('shop_logos')
export class shop_logos extends AttachmentT {
  @OneToOne(() => ShopT, (shop: ShopT) => shop.logo, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  shop_logo: ShopT;
}

@Entity('shop_cover')
export class shop_cover extends AttachmentT {
  @OneToOne(() => ShopT, (shop: ShopT) => shop.cover_image, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  shop_cover: ShopT;
}

@Entity('coupon_attachment')
export class CouponAttachment extends AttachmentT {
  @OneToOne(() => CouponT, (cou: CouponT) => cou.image, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  coupon_image: CouponT;
}

@Entity('categoriattachment')
export class CategoriAttachment extends AttachmentT {
  @OneToOne(() => CategoryT, (cat: CategoryT) => cat.image, {})
  @JoinColumn()
  logo: CategoryT;
}

@Entity('PaymentInfo')
export class PaymentInfoT {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: true })
  account: string;
  @Column({ nullable: true })
  name: string;
  @Column({ nullable: true })
  email: string;
  @Column({ nullable: true })
  bank: string;
  @OneToOne(() => BalanceT, (bal: BalanceT) => bal.payment_info, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  balance: BalanceT;
}

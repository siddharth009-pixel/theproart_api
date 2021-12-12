import { toUnicode } from 'punycode';
import { CoreEntity, CoreEntityT } from 'src/common/entities/core.entity';
import { ShopT } from 'src/shops/entities/shop.entity';
import { ProfileT } from 'src/users/entities/profile.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BalanceT } from './balance.entity';

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
  })
  @JoinColumn()
  profile: ProfileT;
}

@Entity('shop_logos')
export class shop_logos extends AttachmentT {
  @OneToOne(() => ShopT, (shop: ShopT) => shop.logo, {
    cascade: true,
  })
  @JoinColumn()
  shop_logo: ShopT;
}

@Entity('shop_cover')
export class shop_cover extends AttachmentT {
  @OneToOne(() => ShopT, (shop: ShopT) => shop.cover_image, {
    cascade: true,
  })
  @JoinColumn()
  shop_cover: ShopT;
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
  })
  @JoinColumn()
  balance: BalanceT;
}

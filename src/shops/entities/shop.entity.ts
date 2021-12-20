import {
  ShopAddress,
  UserAddress,
} from 'src/addresses/entities/address.entity';
import {
  Attachment,
  shop_cover,
  shop_logos,
} from 'src/common/entities/attachment.entity';
import { BalanceT } from 'src/common/entities/balance.entity';
import { CoreEntity, CoreEntityT } from 'src/common/entities/core.entity';
import { ShopSettingsT } from 'src/common/entities/shopsetting.entity';
import { Location, ShopSocials } from 'src/settings/entities/setting.entity';
import { User, UserT } from 'src/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToMany, OneToOne } from 'typeorm';

export class Balance {
  id: number;
  admin_commission_rate: number;
  shop: Shop;
  total_earnings: number;
  withdrawn_amount: number;
  current_balance: number;
  payment_info: PaymentInfo;
}

export class PaymentInfo {
  account: string;
  name: string;
  email: string;
  bank: string;
}

export class ShopSettings {
  socials: ShopSocials[];
  contact: string;
  location: Location;
  website: string;
}

export class Shop extends CoreEntity {
  owner_id: number;
  owner: User;
  staffs?: User[];
  is_active: boolean;
  orders_count: number;
  products_count: number;
  balance?: Balance;
  name: string;
  slug: string;
  description?: string;
  cover_image: Attachment;
  logo?: Attachment;
  address: UserAddress;
  settings?: ShopSettings;
}

@Entity('Shop')
export class ShopT extends CoreEntityT {
  @Column({ default: true })
  is_active: boolean;

  @Column({ default: 0 })
  orders_count: number;

  // @Column({
  //   nullable: true,
  //   default: 1,
  // })
  // owner_id: number;

  @Column({ default: 0 })
  products_count: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  slug: string;

  @Column({ nullable: true })
  description: string;

  @OneToOne(() => UserT, (owner) => owner.shop_id, {
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  owner: UserT;

  @ManyToMany(() => UserT, (staffs) => staffs.shops, {
    nullable: true,
  })
  staffs: UserT[];

  @OneToOne(() => shop_cover, (photo: shop_cover) => photo.shop_cover, {
    eager: true,
    nullable: true,
  })
  cover_image: shop_cover;

  @OneToOne(() => shop_logos, (logo: shop_logos) => logo.shop_logo, {
    eager: true,
    nullable: true,
  })
  logo: shop_logos;

  @OneToOne(
    () => ShopAddress,
    (shop_address: ShopAddress) => shop_address.shop,
    {
      eager: true,
      nullable: true,
    },
  )
  address: ShopAddress;

  @OneToOne(() => BalanceT, (balnace) => balnace.shop, {
    eager: true,
    nullable: true,
  })
  balance: BalanceT;

  @OneToOne(() => ShopSettingsT, (settings) => settings.shop, {
    eager: true,
    nullable: true,
  })
  settings: ShopSettingsT;
}

import {
  UserAddress,
  UserAddressT,
} from 'src/addresses/entities/address.entity';
import { Attachment, AttachmentT } from 'src/common/entities/attachment.entity';
import { CoreEntity, CoreEntityT } from 'src/common/entities/core.entity';
import {
  Location,
  LocationT,
  ShopSocials,
  ShopSocialsT,
} from 'src/settings/entities/setting.entity';
import { User, UserT } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

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

@Entity('PaymentInfo')
export class PaymentInfoT {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  account: string;
  @Column()
  name: string;
  @Column()
  email: string;
  @Column()
  bank: string;
}

@Entity('ShopSettings')
export class ShopSettingsT {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => ShopSocialsT, (socials) => socials.id)
  @JoinColumn()
  socials: ShopSocialsT[];

  @Column()
  contact: string;

  @OneToOne(() => LocationT, (location) => location.id)
  @JoinColumn()
  location: Location;

  @Column()
  website: string;
}

@Entity('Balance')
export class BalanceT {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  admin_commission_rate: number;

  // @OneToOne(()=>ShopT,st=>st.balance)
  // shop: ShopT;

  @Column()
  total_earnings: number;

  @Column()
  withdrawn_amount: number;

  @Column()
  current_balance: number;

  @OneToOne(() => PaymentInfoT, (payment_info) => payment_info.id)
  @JoinColumn()
  payment_info: PaymentInfoT;
}

@Entity('Shop')
export class ShopT extends CoreEntityT {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  owner_id: number;

  @Column()
  is_active: boolean;

  @Column()
  orders_count: number;

  @Column()
  products_count: number;

  @Column()
  name: string;

  @Column()
  slug: string;

  @Column()
  description?: string;

  @OneToOne(() => BalanceT, (balnace) => balnace.id)
  @JoinColumn()
  balance?: Balance;

  @OneToOne(() => UserT, (owner) => owner.shop_id)
  @JoinColumn()
  owner: UserT;

  @ManyToMany(() => UserT, (staffs) => staffs.shops)
  @JoinTable()
  staffs?: UserT[];

  @OneToOne(() => AttachmentT, (photo) => photo.id)
  @JoinColumn()
  cover_image: AttachmentT;

  @OneToOne(() => AttachmentT, (logo) => logo.id)
  @JoinColumn()
  logo?: AttachmentT;

  @OneToOne(() => UserAddressT, (useaddress) => useaddress.id)
  @JoinColumn()
  address: UserAddressT;

  @OneToOne(() => ShopSettingsT, (settings) => settings.id)
  @JoinColumn()
  settings?: ShopSettingsT;
}

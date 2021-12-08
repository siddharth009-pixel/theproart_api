import { CoreEntity, CoreEntityT } from 'src/common/entities/core.entity';
import { User, UserT } from 'src/users/entities/user.entity';
import {
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum AddressType {
  BILLING = 'billing',
  SHIPPING = 'shipping',
}

export class Address extends CoreEntity {
  title: string;
  default: boolean;
  address: UserAddress;
  type: AddressType;
  customer: User;
}

export class UserAddress {
  street_address: string;
  country: string;
  city: string;
  state: string;
  zip: string;
}

@Entity('UserAddress')
export class UserAddressT {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  street_address: string;
  @Column()
  country: string;
  @Column()
  city: string;
  @Column()
  state: string;
  @Column()
  zip: string;
}

@Entity('Address')
export class AddressT extends CoreEntityT {
  @Column()
  title: string;

  @Column()
  default: boolean;

  @OneToOne(() => UserAddressT, (useraddresst) => useraddresst.id, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  address: UserAddressT;

  @Column({
    type: 'enum',
    enum: AddressType,
    default: AddressType.BILLING,
  })
  type: AddressType;

  @ManyToOne(() => UserT, (customer) => customer.address)
  customer: UserT;
}

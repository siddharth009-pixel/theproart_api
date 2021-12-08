import { Attachment, AttachmentT } from 'src/common/entities/attachment.entity';
import { CoreEntity, CoreEntityT } from 'src/common/entities/core.entity';
import { Order, OrderT } from 'src/orders/entities/order.entity';
import {
  Check,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';

export enum CouponType {
  FIXED_COUPON = 'fixed',
  PERCENTAGE_COUPON = 'percentage',
  FREE_SHIPPING_COUPON = 'free_shipping',
}

export class Coupon extends CoreEntity {
  code: string;
  description?: string;
  orders?: Order[];
  type: CouponType;
  image: Attachment;
  is_valid: boolean;
  amount: number;
  active_from: string;
  expire_at: string;
}

@Entity('Coupon')
export class CouponT extends CoreEntityT {
  @Column()
  code: string;

  @Column()
  description?: string;

  @OneToMany(() => OrderT, (ordert: OrderT) => ordert.coupon)
  orders?: Order[];

  @Column({
    type: 'enum',
    enum: CouponType,
    default: CouponType.FIXED_COUPON,
  })
  type: CouponType;

  @OneToOne(() => AttachmentT, (attachmentt: AttachmentT) => attachmentt.id, {
    eager: true,
  })
  @JoinColumn()
  image: AttachmentT;

  @Column()
  is_valid: boolean;

  @Column()
  amount: number;

  @Column()
  active_from: string;

  @Column()
  expire_at: string;
}

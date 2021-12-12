import {
  Attachment,
  AttachmentT,
  CouponAttachment,
} from 'src/common/entities/attachment.entity';
import { CoreEntity, CoreEntityT } from 'src/common/entities/core.entity';
import { Order, OrderT } from 'src/orders/entities/order.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';

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

@Entity('coupon')
export class CouponT extends CoreEntityT {
  @Column()
  code: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => OrderT, (ordert: OrderT) => ordert.coupon, {
    nullable: true,
  })
  orders: OrderT[];

  @Column({
    type: 'enum',
    enum: CouponType,
    default: CouponType.FIXED_COUPON,
  })
  type: CouponType;

  @OneToOne(
    () => CouponAttachment,
    (attachmentt: CouponAttachment) => attachmentt.coupon_image,
    {
      eager: true,
      nullable: true,
      onDelete: 'CASCADE',
    },
  )
  image: CouponAttachment;

  @Column({ default: true })
  is_valid: boolean;

  @Column()
  amount: number;

  @Column({ nullable: true })
  active_from: string;

  @Column({ nullable: true })
  expire_at: string;
}

import {
  UserAddress,
  UserAddressT,
} from 'src/addresses/entities/address.entity';
import { CoreEntity, CoreEntityT } from 'src/common/entities/core.entity';
import { Coupon, CouponT } from 'src/coupons/entities/coupon.entity';
import { OrderProductPivot, Product, ProductT } from 'src/products/entities/product.entity';
import { Shop, ShopT } from 'src/shops/entities/shop.entity';
import { User, UserT } from 'src/users/entities/user.entity';
import {
  Check,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { OrderProductPivotT } from '../../common/entities/orderproductpivot.entity';
import { OrderStatus, OrderStatusT } from './order-status.entity';
export enum PaymentGatewayType {
  STRIPE = 'stripe',
  CASH_ON_DELIVERY = 'cod',
}

export class Order extends CoreEntity {
  tracking_number: string;
  customer_id: number;
  customer_contact: string;
  customer: User;
  parent_order?: Order;
  children: Order[];
  status: OrderStatus;
  amount: number;
  sales_tax: number;
  total: number;
  paid_total: number;
  payment_id?: string;
  payment_gateway: PaymentGatewayType;
  coupon?: Coupon;
  shop: Shop;
  discount?: number;
  delivery_fee: number;
  delivery_time: string;
  products: Product[];
  billing_address: UserAddress;
  shipping_address: UserAddress;
}

@Entity('orders')
export class OrderT extends CoreEntityT {
  @Column()
  tracking_number: string;

  @Column()
  customer_id: number;

  @Column()
  customer_contact: string;

  @Column()
  amount: number;

  @Column()
  sales_tax: number;

  @Column()
  total: number;

  @Column()
  paid_total: number;

  @Column({ nullable: true })
  payment_id?: string;

  @Column({ nullable: true })
  discount?: number;

  @Column()
  delivery_fee: number;

  @Column()
  delivery_time: string;

  @Column({
    type: 'enum',
    enum: PaymentGatewayType,
    default: PaymentGatewayType.CASH_ON_DELIVERY,
  })
  payment_gateway: PaymentGatewayType;


  @ManyToOne(() => UserT, (usert: UserT) => usert.orders, {
    eager: true,
    onDelete: 'CASCADE',
  })
  customer: UserT;

  @OneToMany(() => OrderProductPivotT, pivot => pivot.order, {
    nullable: true,
    eager: true,
  })
  orderProductPivot: OrderProductPivotT[]

  @ManyToOne(() => CouponT, (coupent: CouponT) => coupent.orders, {
    eager: true,
    nullable: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'coupon_id' })
  coupon?: CouponT;

  @ManyToOne(
    () => UserAddressT,
    (useraddresst: UserAddressT) => useraddresst.id,
    { eager: true, nullable: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  @JoinColumn()
  billing_address: UserAddressT;

  @ManyToOne(
    () => UserAddressT,
    (useraddresst: UserAddressT) => useraddresst.id,
    { eager: true, nullable: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  @JoinColumn()
  shipping_address: UserAddressT;

  @ManyToMany(() => ProductT, (productt) => productt.orders, {
    eager: true,
    nullable: true,
  })
  @JoinTable()
  products: ProductT[];

  // @ManyToOne(() => ShopT, (shop) => shop.id, {
  //   nullable: true,
  // })
  // @JoinColumn()
  // shop: ShopT;

  // @ManyToOne((type) => OrderT, (category) => category.children, {
  //   nullable: true,
  // })
  // parent_order?: OrderT;

  // @OneToMany((type) => OrderT, (category) => category.parent_order, {
  //   nullable: true,
  // })
  // children?: OrderT[];

  // @ManyToOne(
  //   () => OrderStatusT,
  //   (orderstatust: OrderStatusT) => orderstatust.id,
  //   {
  //     eager: true,
  //     cascade: true,
  //   },
  // )
  // @JoinColumn()
  // status: OrderStatusT;
}

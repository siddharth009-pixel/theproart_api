import { ProductT } from 'src/products/entities/product.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderStatusT } from '../../orders/entities/order-status.entity';
import { OrderT } from '../../orders/entities/order.entity';
import { ShopT } from '../../shops/entities/shop.entity';
import { CoreEntityT } from './core.entity';

@Entity('OrderProductPivot')
export class OrderProductPivotT extends CoreEntityT {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: true })
  order_id: number;
  @Column({ nullable: true })
  variation_option_id?: number;
  @Column({ nullable: true })
  order_quantity: number;
  @Column({ nullable: true })
  unit_price: number;
  @Column({ nullable: true })
  subtotal: number;
  @Column({ nullable: true })
  product_id: number;

  @ManyToOne(() => OrderT, order => order.orderProductPivot,
    { nullable: true })
  @JoinColumn()
  order: OrderT

  @Column({ nullable: true })
  shop_id: number;

  @ManyToOne(() => ShopT, shop => shop.id, { nullable: true })
  @JoinColumn()
  shop: ShopT;

  @Column({ nullable: true })
  deducted: boolean;

  // @ManyToOne(() => ProductT, product => product.id,{
  //   nullable: true,
  //   eager: true
  // })
  // @JoinColumn()
  // product: ProductT;

  @ManyToOne(() => ProductT, product => product.id,{eager: true})
  @JoinColumn()
  pivot: ProductT;

  @ManyToOne(
    () => OrderStatusT,
    (orderstatust: OrderStatusT) => orderstatust.id,
    {
      eager: true,
      cascade: true,
    },
  )
  @JoinColumn()
  status: OrderStatusT;

  
}

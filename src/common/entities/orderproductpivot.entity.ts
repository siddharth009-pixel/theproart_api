import { ProductT } from 'src/products/entities/product.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('OrderProductPivot')
export class OrderProductPivotT {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: true })
  variation_option_id?: number;
  @Column({ nullable: true })
  order_quantity: number;
  @Column({ nullable: true })
  unit_price: number;
  @Column({ nullable: true })
  subtotal: number;
  @OneToOne(() => ProductT, (att) => att.pivot, {
    nullable: true,
    cascade: true,
  })
  @JoinColumn()
  product: ProductT;
}

import { ProductT } from 'src/products/entities/product.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { VariationOptionT } from './variationoption.entity';

@Entity('Variation')
export class VariationT {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @Column()
  price: number;
  @Column()
  sku: string;
  @Column()
  is_disable: boolean;
  @Column()
  sale_price?: number;
  @Column()
  quantity: number;
  @ManyToOne(() => ProductT, (pro) => pro.variation_options)
  @JoinColumn()
  product: ProductT;

  @OneToMany(() => VariationOptionT, (vo) => vo.id)
  options: VariationOptionT[];
}

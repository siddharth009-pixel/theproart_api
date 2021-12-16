import { CoreEntity, CoreEntityT } from 'src/common/entities/core.entity';
import { ProductT } from 'src/products/entities/product.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Attribute, AttributeT } from './attribute.entity';

export class AttributeValue extends CoreEntity {
  shop_id: number;
  value: string;
  meta?: string;
  attribute: Attribute;
}

@Entity('AttributeValue')
export class AttributeValueT extends CoreEntityT {
  @Column({ nullable: true })
  shop_id: number;

  @Column({ nullable: true })
  value: string;

  @Column({ nullable: true })
  meta: string;

  @ManyToOne(() => ProductT, (values: ProductT) => values.variations, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  product: ProductT;

  @ManyToOne(() => AttributeT, (att) => att.values, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  attribute: AttributeT;
}

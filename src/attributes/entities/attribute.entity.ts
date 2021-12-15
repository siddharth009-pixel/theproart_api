import { CoreEntity, CoreEntityT } from 'src/common/entities/core.entity';
import { Shop, ShopT } from 'src/shops/entities/shop.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { AttributeValue, AttributeValueT } from './attribute-value.entity';

export class Attribute extends CoreEntity {
  name: string;
  shop_id: number;
  shop: Shop;
  slug: string;
  values: AttributeValue[];
}

@Entity('Attribute')
export class AttributeT extends CoreEntityT {
  @Column()
  name: string;

  @Column({ nullable: true })
  shop_id: number;

  @Column()
  slug: string;

  @OneToMany(() => AttributeValueT, (values) => values.attribute, {
    eager: true,
  })
  values: AttributeValueT[];

  @ManyToOne(() => ShopT, {})
  @JoinColumn()
  shop: ShopT;
}

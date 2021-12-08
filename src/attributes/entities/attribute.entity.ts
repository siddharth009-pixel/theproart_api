import { AttachmentT } from 'src/common/entities/attachment.entity';
import { CoreEntity, CoreEntityT } from 'src/common/entities/core.entity';
import { Shop } from 'src/shops/entities/shop.entity';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
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
  @Column()
  shop_id: number;
  @Column()
  slug: string;
  @OneToMany(()=>AttributeValueT,values=>values.attribute)
  values: AttributeValueT[];
  shop: Shop;

}
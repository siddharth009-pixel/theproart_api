import { CoreEntity, CoreEntityT } from 'src/common/entities/core.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Attribute, AttributeT } from './attribute.entity';

export class AttributeValue extends CoreEntity {
  shop_id: number;
  value: string;
  meta?: string;
  attribute: Attribute;
}

@Entity('AttributeValue')
export class AttributeValueT extends CoreEntityT {
  @Column()
  shop_id: number;
  @Column()
  value: string;
  @Column()
  meta?: string;
  @ManyToOne(() => AttributeT, (att) => att.values)
  attribute: AttributeT;
}

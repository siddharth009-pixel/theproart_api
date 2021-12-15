import { CoreEntity, CoreEntityT } from 'src/common/entities/core.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
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
  @ManyToOne(() => AttributeT, (att) => att.values, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  attribute: AttributeT;
}

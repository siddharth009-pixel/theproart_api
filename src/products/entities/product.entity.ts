import {
  AttributeValue,
  AttributeValueT,
} from 'src/attributes/entities/attribute-value.entity';
import { Category, CategoryT } from 'src/categories/entities/category.entity';
import { Attachment, AttachmentT } from 'src/common/entities/attachment.entity';
import { CoreEntity, CoreEntityT } from 'src/common/entities/core.entity';
import { Order, OrderT } from 'src/orders/entities/order.entity';
import { Shop } from 'src/shops/entities/shop.entity';
import { Tag, TagT } from 'src/tags/entities/tag.entity';
import { Type, TypeT } from 'src/types/entities/type.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
export enum ProductStatus {
  PUBLISH = 'publish',
  DRAFT = 'draft',
}
export enum ProductType {
  SIMPLE = 'simple',
  VARIABLE = 'variable',
}

export class Product extends CoreEntity {
  name: string;
  slug: string;
  type: Type;
  type_id: number;
  product_type: ProductType;
  categories: Category[];
  tags?: Tag[];
  variations?: AttributeValue[];
  variation_options?: Variation[];
  pivot?: OrderProductPivot;
  orders?: Order[];
  shop: Shop;
  shop_id: number;
  related_products?: Product[];
  description: string;
  in_stock: boolean;
  is_taxable: boolean;
  sale_price?: number;
  max_price?: number;
  min_price?: number;
  sku?: string;
  gallery?: Attachment[];
  image?: Attachment;
  status: ProductStatus;
  height?: string;
  length?: string;
  width?: string;
  price?: number;
  quantity: number;
  unit: string;
}

export class OrderProductPivot {
  variation_option_id?: number;
  order_quantity: number;
  unit_price: number;
  subtotal: number;
}

export class Variation {
  id: number;
  title: string;
  price: number;
  sku: string;
  is_disable: boolean;
  sale_price?: number;
  quantity: number;
  options: VariationOption[];
}

export class VariationOption {
  name: string;
  value: string;
}

@Entity('OrderProductPivot')
export class OrderProductPivotT {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  variation_option_id?: number;
  @Column()
  order_quantity: number;
  @Column()
  unit_price: number;
  @Column()
  subtotal: number;
}

@Entity('VariationOption')
export class VariationOptionT {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  value: string;
}

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
  @OneToMany(() => VariationOptionT, (vo) => vo.id)
  options: VariationOptionT[];
}

@Entity('Product')
export class ProductT extends CoreEntityT {
  @Column()
  name: string;

  @Column()
  slug: string;

  @Column()
  type_id: number;

  @Column()
  description: string;

  @Column()
  in_stock: boolean;

  @Column()
  is_taxable: boolean;

  @Column()
  sale_price?: number;

  @Column()
  max_price?: number;

  @Column()
  min_price?: number;

  @Column()
  sku?: string;

  @Column()
  height?: string;

  @Column()
  length?: string;

  @Column()
  width?: string;

  @Column()
  price?: number;

  @Column()
  quantity: number;

  @Column()
  unit: string;

  @OneToOne(() => TypeT, (typ) => typ.id)
  type: TypeT;

  @Column({
    type: 'enum',
    enum: ProductType,
    default: ProductType.SIMPLE,
  })
  product_type: ProductType;

  @Column({
    type: 'enum',
    enum: ProductStatus,
    default: ProductStatus.DRAFT,
  })
  status: ProductStatus;

  @ManyToMany(() => CategoryT, (cate) => cate.products)
  categories: CategoryT[];

  @ManyToMany(() => TagT, (tagt) => tagt.products)
  tags: TagT[];

  @OneToMany(() => AttributeValueT, (att) => att.id)
  variations?: AttributeValueT[];

  @OneToMany(() => VariationT, (att) => att.id)
  variation_options?: VariationT[];

  @OneToOne(() => OrderProductPivotT, (att) => att.id)
  pivot?: OrderProductPivotT;

  @ManyToMany(() => OrderT, (orderT) => orderT.products)
  orders?: OrderT[];

  @OneToMany(() => AttachmentT, (att) => att.id)
  gallery?: AttachmentT[];

  @OneToOne(() => AttachmentT, (att) => att.id)
  image?: AttachmentT;

  // shop: Shop;
  // related_products?: Product[];
  // shop_id: number;
}

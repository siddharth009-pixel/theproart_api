import {
  AttributeValue,
  AttributeValueT,
} from 'src/attributes/entities/attribute-value.entity';
import { Category, CategoryT } from 'src/categories/entities/category.entity';
import {
  Attachment,
  ProductAttachment,
  ProductGallery,
} from 'src/common/entities/attachment.entity';
import { CoreEntity, CoreEntityT } from 'src/common/entities/core.entity';
import { OrderProductPivotT } from 'src/common/entities/orderproductpivot.entity';
import { VariationT } from 'src/common/entities/variation.entity';
import { Order, OrderT } from 'src/orders/entities/order.entity';
import { Shop, ShopT } from 'src/shops/entities/shop.entity';
import { Tag, TagT } from 'src/tags/entities/tag.entity';
import { Type, TypeT } from 'src/types/entities/type.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  ManyToOne,
  OneToOne,
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
@Entity('Product')
export class ProductT extends CoreEntityT {
  @Column()
  name: string;

  @Column()
  slug: string;

  @Column({ default: 0 })
  type_id: number;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true, default: true })
  in_stock: boolean;

  @Column({ nullable: true, default: true })
  is_taxable: boolean;

  @Column({ nullable: true })
  sale_price: number;

  @Column({ nullable: true })
  max_price: number;

  @Column({ nullable: true })
  min_price: number;

  @Column({ nullable: true })
  sku: string;

  @Column({ nullable: true })
  height: string;

  @Column({ nullable: true })
  length: string;

  @Column({ nullable: true })
  width: string;

  @Column({ nullable: true })
  price: number;

  @Column({ nullable: true, default: 5 })
  quantity: number;

  @Column({ nullable: true })
  unit: string;

  @ManyToOne(() => TypeT, (typ) => typ.id, {
    eager: true,
    nullable: true,
  })
  @JoinColumn()
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

  @ManyToMany(() => CategoryT, (cate) => cate.products, {
    eager: true,
    nullable: true,
  })
  @JoinTable()
  categories: CategoryT[];

  @ManyToMany(() => TagT, (tagt) => tagt.products, {
    eager: true,
    nullable: true,
  })
  @JoinTable()
  tags: TagT[];

  @OneToMany(() => AttributeValueT, (att) => att.product, {
    nullable: true,
    eager: true,
  })
  variations: AttributeValueT[];

  @OneToMany(() => VariationT, (att) => att.product, {
    nullable: true,
    eager: true,
  })
  variation_options: VariationT[];

  @OneToOne(() => OrderProductPivotT, (att) => att.product, {
    nullable: true,
    eager: true,
  })
  pivot: OrderProductPivotT;

  @ManyToMany(() => OrderT, (orderT) => orderT.products, {
    nullable: true,
    eager: true,
  })
  orders: OrderT[];

  @OneToMany(() => ProductGallery, (att) => att.product, {
    nullable: true,
    eager: true,
  })
  gallery: ProductGallery[];

  @OneToOne(() => ProductAttachment, (att) => att.product, {
    nullable: true,
    eager: true,
  })
  image: ProductAttachment;

  @OneToOne(() => ShopT, { nullable: true, eager: true })
  @JoinColumn()
  shop: ShopT;

  @Column({ nullable: true })
  shop_id: number;

  // related_products?: Product[];
}

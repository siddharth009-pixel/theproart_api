import {
  Attachment,
  AttachmentT,
  CategoriAttachment,
} from 'src/common/entities/attachment.entity';
import { CoreEntity, CoreEntityT } from 'src/common/entities/core.entity';
import { Product, ProductT } from 'src/products/entities/product.entity';
import { Type, TypeT } from 'src/types/entities/type.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';

export class Category extends CoreEntity {
  name: string;
  slug: string;
  parent?: Category;
  children?: Category[];
  details?: string;
  image?: Attachment;
  icon?: string;
  type?: Type;
  products?: Product[];
}

@Entity('category')
export class CategoryT extends CoreEntityT {
  @Column()
  name: string;

  @Column()
  slug: string;

  @Column({ nullable: true })
  details: string;

  @Column({ nullable: true })
  icon?: string;

  @OneToOne(() => TypeT, (typet) => typet.id)
  type?: TypeT;

  @ManyToOne(() => CategoryT, (category) => category.children)
  parent: CategoryT;

  @OneToMany(() => CategoryT, (category) => category.parent)
  children: CategoryT[];

  @ManyToMany(() => ProductT, (p) => p.categories)
  products: ProductT[];

  @OneToOne(() => CategoriAttachment, (attch) => attch.categories_logo, {
    eager: true,
    nullable: true,
  })
  image: CategoriAttachment;
}

import {
  Attachment,
  CategoriAttachment,
} from 'src/common/entities/attachment.entity';
import { CoreEntity, CoreEntityT } from 'src/common/entities/core.entity';
import { Product, ProductT } from 'src/products/entities/product.entity';
import { Type, TypeT } from 'src/types/entities/type.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToOne,
  Tree,
  TreeChildren,
  TreeParent,
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
@Tree('closure-table')
export class CategoryT extends CoreEntityT {
  @Column()
  name: string;

  @Column()
  slug: string;

  @Column({ nullable: true })
  details: string;

  @Column({ nullable: true })
  icon: string;

  @ManyToOne(() => TypeT, (typet) => typet.id, {
    cascade: true,
    eager: true,
    nullable: true,
  })
  @JoinColumn()
  type: TypeT;

  @TreeParent({})
  parent: CategoryT;

  @TreeChildren({
    cascade: true,
  })
  children: CategoryT[];

  @ManyToMany(() => ProductT, (p) => p.categories)
  products: ProductT[];

  @OneToOne(() => CategoriAttachment, (a) => a.logo, {
    eager: true,
    nullable: true,
  })
  image: CategoriAttachment;
}

import {
  Attachment,
  TagAttachment,
} from 'src/common/entities/attachment.entity';
import { CoreEntity, CoreEntityT } from 'src/common/entities/core.entity';
import { Product, ProductT } from 'src/products/entities/product.entity';
import { Type } from 'src/types/entities/type.entity';
import { Column, Entity, ManyToMany, OneToOne } from 'typeorm';

export class Tag extends CoreEntity {
  name: string;
  slug: string;
  parent: number;
  details: string;
  image: Attachment;
  icon: string;
  type: Type;
  products: Product[];
}

@Entity('Tags')
export class TagT extends CoreEntityT {
  @Column()
  name: string;

  @Column()
  slug: string;

  @Column()
  parent: number;

  @Column()
  details: string;

  @OneToOne(() => TagAttachment, (attch) => attch.tag, {
    eager: true,
    nullable: true,
  })
  image: TagAttachment;

  @Column()
  icon: string;

  // @OneToOne(() => TypeT, { eager: true })
  // type: TypeT;

  @ManyToMany(() => ProductT, (product) => product.tags)
  products: ProductT[];
}

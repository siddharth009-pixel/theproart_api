import {
  Attachment,
  TagAttachment,
} from 'src/common/entities/attachment.entity';
import { CoreEntity, CoreEntityT } from 'src/common/entities/core.entity';
import { Product, ProductT } from 'src/products/entities/product.entity';
import { Type, TypeT } from 'src/types/entities/type.entity';
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToOne } from 'typeorm';

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

  @Column({ default: 0 })
  parent: number;

  @Column()
  details: string;

  @OneToOne(() => TagAttachment, (attch) => attch.tag, {
    eager: true,
    nullable: true,
    onDelete: 'NO ACTION',
  })
  image: TagAttachment;

  @Column()
  icon: string;

  @ManyToOne(() => TypeT, (type) => type.tag, {
    nullable: true,
    eager: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  type: TypeT;

  @ManyToMany(() => ProductT, (product) => product.tags, {
    nullable: true,
  })
  products: ProductT[];
}

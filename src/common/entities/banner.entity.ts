import { TypeT } from 'src/types/entities/type.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BannerAttachment } from './attachment.entity';
@Entity('Banner')
export class BannerT {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  description: string;

  @OneToOne(() => BannerAttachment, (atta) => atta.banner, {
    eager: true,
    nullable: true,
    onDelete: 'CASCADE',
  })
  image: BannerAttachment;

  @ManyToOne(() => TypeT, (atta) => atta.banners, {
    cascade: true,
    nullable: true,
    onDelete: 'CASCADE',
  })
  type: TypeT;
}

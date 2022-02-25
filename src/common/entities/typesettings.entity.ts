import { TypeT } from 'src/types/entities/type.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity('TypeSettings')
export class TypeSettingsT {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  isHome: boolean;

  @Column()
  layoutType: string;

  @Column()
  productCard: string;

  @OneToOne(() => TypeT, (type) => type.settings, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  type: TypeT;
}

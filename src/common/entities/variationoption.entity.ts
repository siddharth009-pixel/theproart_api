import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('VariationOption')
export class VariationOptionT {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  value: string;
}

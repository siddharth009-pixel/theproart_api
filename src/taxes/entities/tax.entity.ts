import { CoreEntity, CoreEntityT } from 'src/common/entities/core.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export class Tax extends CoreEntity {
  name: string;
  rate: number;
  is_global: boolean;
  country?: string;
  state?: string;
  zip?: string;
  city?: string;
  priority?: number;
  on_shipping: boolean;
}
@Entity('tax')
export class TaxT extends CoreEntityT {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  rate: number;
  @Column({ default: true })
  is_global: boolean;
  @Column({ nullable: true })
  country: string;
  @Column({ nullable: true })
  state: string;
  @Column({ nullable: true })
  zip: string;
  @Column({ nullable: true })
  city: string;
  @Column({ nullable: true })
  priority: number;
  @Column({ default: true })
  on_shipping: boolean;
}

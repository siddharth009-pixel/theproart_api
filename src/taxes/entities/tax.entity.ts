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
@Entity('Tax')
export class TaxT extends CoreEntityT {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  rate: number;
  @Column()
  is_global: boolean;
  @Column()
  country?: string;
  @Column()
  state?: string;
  @Column()
  zip?: string;
  @Column()
  city?: string;
  @Column()
  priority?: number;
  @Column()
  on_shipping: boolean;
}

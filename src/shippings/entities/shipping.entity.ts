import { CoreEntity, CoreEntityT } from 'src/common/entities/core.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export class Shipping extends CoreEntity {
  name: string;
  amount: number;
  is_global: boolean;
  type: ShippingType;
}

export enum ShippingType {
  FIXED = 'fixed',
  PERCENTAGE = 'percentage',
  FREE = 'free',
}

@Entity('Shipping')
export class ShippingT extends CoreEntityT {
  @PrimaryGeneratedColumn()
  id:number;
  @Column()
  name: string;
  @Column()
  amount: number;
  @Column()
  is_global: boolean;
  @Column({
    type:"enum",
    enum:ShippingType,
    default:ShippingType.FIXED
  })
  type: ShippingType;
}
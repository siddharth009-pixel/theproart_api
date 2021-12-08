import { CoreEntity, CoreEntityT } from 'src/common/entities/core.entity';
import { Shop, ShopT } from 'src/shops/entities/shop.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export class Withdraw extends CoreEntity {
  amount: number;
  status: WithdrawStatus;
  shop_id: number;
  shop: Shop;
  payment_method: string;
  details: string;
  note: string;
}

export enum WithdrawStatus {
  APPROVED = 'Approved',
  PENDING = 'Pending',
  ON_HOLD = 'On hold',
  REJECTED = 'Rejected',
  PROCESSING = 'Processing',
}

@Entity('Withdraw')
export class WithdrawT extends CoreEntityT {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  amount: number;
  @Column({
    type: 'enum',
    enum: WithdrawStatus,
    default: WithdrawStatus.APPROVED,
  })
  status: WithdrawStatus;
  @Column()
  shop_id: number;
  @OneToMany(() => ShopT, (sp) => sp.id)
  shop: ShopT;
  @Column()
  payment_method: string;
  @Column()
  details: string;
  @Column()
  note: string;
}

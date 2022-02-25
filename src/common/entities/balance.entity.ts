import { ShopT } from 'src/shops/entities/shop.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PaymentInfoT } from './attachment.entity';
import { DeductionPaymentT } from './deductionPayment.entity';

@Entity('Balance')
export class BalanceT  {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 20 })
  admin_commission_rate: number;

  @OneToOne(() => ShopT, (st) => st.balance, { cascade: true ,
    onDelete: 'CASCADE',
    onUpdate:'CASCADE'})
  @JoinColumn()
  shop: ShopT;

  @Column({ default: 0 })
  total_earnings: number;

  @Column({ default: 0 })
  withdrawn_amount: number;

  @Column({ default: 0 })
  current_balance: number;

  @Column({ default: 0 })
  received_number: number;

  @OneToOne(() => PaymentInfoT, (payment_info) => payment_info.balance, {
    eager: true,
    nullable: true,
  })
  payment_info: PaymentInfoT;

  @OneToMany(() => DeductionPaymentT, (ded) => ded.balance)
  deduction_history:DeductionPaymentT[]
}

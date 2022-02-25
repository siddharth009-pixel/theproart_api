import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { BalanceT } from "./balance.entity";
import { CoreEntity, CoreEntityT } from "./core.entity";
import { OrderProductPivotT } from "./orderproductpivot.entity";

@Entity('DeductionPayment')
export class DeductionPaymentT extends CoreEntityT {

    @Column({ nullable: true})
    balance_id: number;

    @ManyToOne(()=>BalanceT,balance=>balance.deduction_history)
    @JoinColumn()
    balance: BalanceT;

    @Column({ nullable: true})
    positive: boolean;

    @Column()
    amount: number;

    @Column({nullable: true})
    orderProductPivot_id:number;

    @OneToOne(()=>OrderProductPivotT,opp=>opp.id,{eager: true})
    @JoinColumn()
    orderProductPivot: OrderProductPivotT;
}
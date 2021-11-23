import { CoreEntity, CoreEntityT } from 'src/common/entities/core.entity';
import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export class Analytics extends CoreEntity {
  totalRevenue?: number;
  totalShops?: number;
  todaysRevenue?: number;
  totalOrders?: number;
  newCustomers?: number;
  totalYearSaleByMonth?: TotalYearSaleByMonth[];
}

export class TotalYearSaleByMonth {
  total?: number;
  month?: string;
}

@Entity('Analytics')
export class AnalyticsT extends CoreEntityT {
  @Column()
  totalRevenue?: number;
  @Column()
  totalShops?: number;
  @Column()
  todaysRevenue?: number;
  @Column()
  totalOrders?: number;
  @Column()
  newCustomers?: number;

  @OneToMany(()=>TotalYearSaleByMonthT,tmt=>tmt.id)
  @JoinColumn()
  totalYearSaleByMonth?: TotalYearSaleByMonthT[];
}

@Entity('TotalYearSaleByMonth')
export class TotalYearSaleByMonthT {
  @PrimaryGeneratedColumn()
  id:number
  @Column()
  total?: number;
  @Column()
  month?: string;
}

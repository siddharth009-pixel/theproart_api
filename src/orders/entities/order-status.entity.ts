import { CoreEntity, CoreEntityT } from 'src/common/entities/core.entity';
import { Column, Entity, OneToOne } from 'typeorm';
import { OrderT } from './order.entity';

export class OrderStatus extends CoreEntity {
  name: string;
  color: string;
  serial: number;
}

@Entity('OrderStatus')
export class OrderStatusT extends CoreEntityT {
  @Column()
  name: string;
  @Column()
  color: string;
  @Column()
  serial: number;
  // @OneToOne(() => OrderT, (orderstatust) => orderstatust.id)
  // status: OrderT;
}

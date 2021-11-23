import { Address, AddressT } from 'src/addresses/entities/address.entity';
import { CoreEntity, CoreEntityT } from 'src/common/entities/core.entity';
import { Order, OrderT } from 'src/orders/entities/order.entity';
import { Shop, ShopT } from 'src/shops/entities/shop.entity';
import { Column, Entity, JoinColumn, ManyToMany, OneToMany, OneToOne } from 'typeorm';
import { Profile, ProfileT } from './profile.entity';

export class User extends CoreEntity {
  name: string;
  email: string;
  password?: string;
  shop_id?: number;
  profile?: Profile;
  shops?: Shop[];
  managed_shop?: Shop;
  is_active?: boolean = true;
  address?: Address[];
  orders?: Order[];
}
@Entity()
export class UserT extends CoreEntityT {
  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password?: string;

  @Column()
  shop_id?: number;

  @OneToOne(()=>ProfileT,(profilet:ProfileT)=>profilet.customer,{
    eager:true,cascade:true
  })
  @JoinColumn()
  profile?: ProfileT;

  @Column({default:true})
  is_active?: boolean;

  @OneToMany(()=>AddressT,(addresst:AddressT)=>addresst.customer,{
    eager:true,cascade:true
  })
  address?: AddressT[];

  @OneToMany(()=>OrderT,(ordert:OrderT)=>ordert.customer,{
    eager:true,cascade:true
  })
  orders?: OrderT[];
  
  @ManyToMany(()=>ShopT,shop=>shop.staffs)
  shops?: Shop[];

  @OneToOne(()=>ShopT,shop=>shop.owner)
  managed_shop?: ShopT;

}
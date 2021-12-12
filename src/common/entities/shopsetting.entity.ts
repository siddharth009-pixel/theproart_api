import { ShopT } from 'src/shops/entities/shop.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('ShopSettings')
export class ShopSettingsT {
  @PrimaryGeneratedColumn()
  id: number;

  // @OneToMany(() => ShopSocialsT, (socials) => socials.id)
  // socials: ShopSocialsT[];

  @Column({ nullable: true })
  contact: string;

  // @OneToOne(() => LocationT, (location) => location.id)
  // @JoinColumn()
  // location: LocationT;

  @Column({ nullable: true })
  website: string;

  @OneToOne(() => ShopT, (shop: ShopT) => shop.settings, {
    cascade: true,
  })
  @JoinColumn()
  shop: ShopT;
}

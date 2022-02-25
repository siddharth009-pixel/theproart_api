import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ContactDetailsT } from "../../settings/entities/setting.entity";

@Entity('ShopSocials')
export class ShopSocialsT {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  icon: string;
  @Column()
  url: string;
  @ManyToOne(() => ContactDetailsT, (sst) => sst.socials,{ 
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
  })
  @JoinColumn()
  contact:ContactDetailsT;
}

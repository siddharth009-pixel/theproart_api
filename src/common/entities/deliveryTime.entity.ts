import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { SettingsOptionsT } from "../../settings/entities/setting.entity";
import { CoreEntity } from "./core.entity";

@Entity('DeliveryTime')
export class DeliveryTimeT extends CoreEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    title: string;
    @Column()
    description: string;

    // @ManyToOne(() => SettingsOptionsT, sett => sett.deliveryTime, {
    //     cascade: true,
    //     onDelete: 'CASCADE',
    // })
    // @JoinColumn()
    // settingsOptions: SettingsOptionsT
}
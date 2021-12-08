import { Type } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export class CoreEntity {
  id: number;
  @Type(() => Date)
  created_at: Date;
  @Type(() => Date)
  updated_at: Date;
}

@Entity('CoreEntity')
export class CoreEntityT {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  created_at: Date;

  @Column({
    default: new Date(),
  })
  updated_at: Date;
}

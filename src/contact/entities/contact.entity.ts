import { CoreEntityT } from 'src/common/entities/core.entity';
import { Column, Entity } from 'typeorm';
@Entity('contact')
export class Contact extends CoreEntityT {
  @Column({ nullable: true })
  email: string;
  @Column({ nullable: true })
  name: string;
  @Column({ nullable: true })
  subject: string;
  @Column({ nullable: true })
  description: string;
}

import { CoreEntity, CoreEntityT } from 'src/common/entities/core.entity';
import { Column, Entity } from 'typeorm';

export class Attachment extends CoreEntity {
  thumbnail?: string;
  original?: string;
}

@Entity('Attachment')
export class AttachmentT extends CoreEntityT {
  @Column()
  thumbnail?: string;
  @Column()
  original?: string;
  
}

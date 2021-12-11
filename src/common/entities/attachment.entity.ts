import { CoreEntity, CoreEntityT } from 'src/common/entities/core.entity';
import { ProfileT } from 'src/users/entities/profile.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';

export class Attachment extends CoreEntity {
  thumbnail?: string;
  original?: string;
}

@Entity('Attachment')
export class AttachmentT extends CoreEntityT {
  @Column({ nullable: true })
  thumbnail?: string;
  @Column({ nullable: true })
  original?: string;
}
@Entity('ProfileAttachment')
export class ProfileAttachment extends AttachmentT {
  @OneToOne(() => ProfileT, (profile: ProfileT) => profile.avatar, {
    cascade: true,
  })
  @JoinColumn()
  profile: ProfileT;
}

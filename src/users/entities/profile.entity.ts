import {
  Attachment,
  ProfileAttachment,
} from 'src/common/entities/attachment.entity';
import { CoreEntity } from 'src/common/entities/core.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User, UserT } from './user.entity';

export class Profile extends CoreEntity {
  avatar?: Attachment;
  bio?: string;
  socials?: Social[];
  contact?: string;
  customer?: User;
}

export class Social {
  type: string;
  link: string;
}

@Entity('Profile')
export class ProfileT extends CoreEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(
    () => ProfileAttachment,
    (attachmentt: ProfileAttachment) => attachmentt.profile,
    {
      eager: true,
      nullable: true,
    },
  )
  avatar: ProfileAttachment;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  contact: string;

  @OneToOne(() => UserT, (usert: UserT) => usert.profile, {
    cascade: true,
  })
  customer: UserT;

  @OneToMany(() => SocialT, (socialid: SocialT) => socialid.profile, {
    nullable: true,
  })
  socials: SocialT[];
}

@Entity('ProfileSocial')
export class SocialT {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  type: string;
  @Column()
  link: string;
  @ManyToOne(() => ProfileT, (customer) => customer.socials)
  profile: ProfileT;
}

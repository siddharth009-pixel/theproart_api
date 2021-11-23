import { Attachment, AttachmentT } from 'src/common/entities/attachment.entity';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
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

@Entity()
export class ProfileT extends CoreEntity {

  @PrimaryGeneratedColumn()
  id:number;

  @OneToOne(()=>AttachmentT,(attachmentt:AttachmentT)=>attachmentt.id,
  {eager:true,cascade:true})
  @JoinColumn()
  avatar?: AttachmentT;

  @Column()
  bio?: string;

  @Column()
  contact?: string;

  @OneToOne(()=>UserT,(usert:UserT)=>usert.profile)
  customer?: UserT;
  
  @OneToMany(()=>SocialT,(socialid:SocialT)=>socialid.id,{
    cascade:true, eager:true})
  @JoinColumn()
  socials?: SocialT[];

}

@Entity()
export class SocialT {
  @PrimaryGeneratedColumn()
  id:number;
  @Column()
  type: string;
  @Column()
  link: string;
}
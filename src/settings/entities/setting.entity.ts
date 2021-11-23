import { AttributeT } from 'src/attributes/entities/attribute.entity';
import { Attachment, AttachmentT } from 'src/common/entities/attachment.entity';
import { CoreEntity, CoreEntityT } from 'src/common/entities/core.entity';
import { Column, Entity, JoinColumn, JoinTable, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

export class Setting extends CoreEntity {
  options: SettingsOptions;
}

export class SettingsOptions {
  siteTitle: string;
  siteSubtitle: string;
  currency: string;
  minimumOrderAmount: number;
  deliveryTime: DeliveryTime[];
  logo: Attachment;
  taxClass: string;
  shippingClass: string;
  seo: SeoSettings;
  google?: GoogleSettings;
  facebook?: FacebookSettings;
  contactDetails: ContactDetails;
}

export class DeliveryTime {
  title: string;
  description: string;
}

export class SeoSettings {
  metaTitle?: string;
  metaDescription?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: Attachment;
  twitterHandle?: string;
  twitterCardType?: string;
  metaTags?: string;
  canonicalUrl?: string;
}

export class GoogleSettings {
  isEnable: boolean;
  tagManagerId: string;
}

export class FacebookSettings {
  isEnable: boolean;
  appId: string;
  pageId: string;
}

export class ContactDetails {
  socials: ShopSocials[];
  contact: string;
  location: Location;
  website: string;
}

export class ShopSocials {
  icon: string;
  url: string;
}

export class Location {
  lat: number;
  lng: number;
  city?: string;
  state: string;
  country: string;
  zip?: string;
  formattedAddress: string;
}



@Entity('DeliveryTime')
export class DeliveryTimeT {
  @PrimaryGeneratedColumn()
  id:number
  @Column()
  title: string;
  @Column()
  description: string;
}

@Entity('SeoSettings')
export class SeoSettingsT {
  @PrimaryGeneratedColumn()
  id:number
  @Column()
  metaTitle?: string;
  @Column()
  metaDescription?: string;
  @Column()
  ogTitle?: string;
  @Column()
  ogDescription?: string;
  @OneToOne(()=>AttributeT,att=>att.id)
  ogImage?: AttachmentT;
  @Column()
  twitterHandle?: string;
  @Column()
  twitterCardType?: string;
  @Column()
  metaTags?: string;
  @Column()
  canonicalUrl?: string;
}

@Entity('GoogleSettings')
export class GoogleSettingsT {
  @PrimaryGeneratedColumn()
  id:number
  @Column()
  isEnable: boolean;
  @Column()
  tagManagerId: string;
}

@Entity('FacebookSettings')
export class FacebookSettingsT {
  @PrimaryGeneratedColumn()
  id:number
  @Column()
  isEnable: boolean;
  @Column()
  appId: string;
  @Column()
  pageId: string;
}

@Entity('ShopSocials')
export class ShopSocialsT {
  @PrimaryGeneratedColumn()
  id:number
  @Column()
  icon: string;
  @Column()
  url: string;
}

@Entity('LocationT')
export class LocationT {
  @PrimaryGeneratedColumn()
  id:number
  @Column()
  lat: number;
  @Column()
  lng: number;
  @Column()
  city?: string;
  @Column()
  state: string;
  @Column()
  country: string;
  @Column()
  zip?: string;
  @Column()
  formattedAddress: string;
}


@Entity('ContactDetails')
export class ContactDetailsT {
  @PrimaryGeneratedColumn()
  id:number

  @OneToMany(()=>ShopSocialsT,sst=>sst.id)
  @JoinColumn()
  socials: ShopSocials[];

  @Column()
  contact: string;
  
  @OneToOne(()=>LocationT,lo=>lo.id)
  @JoinColumn()
  location: LocationT;
  
  @Column()
  website: string;
}

@Entity('SettingsOptions')
export class SettingsOptionsT {
  @PrimaryGeneratedColumn()
  id:number
  @Column()
  siteTitle: string;
  @Column()
  siteSubtitle: string;
  @Column()
  currency: string;
  @Column()
  minimumOrderAmount: number;
  @Column()
  taxClass: string;
  @Column()
  shippingClass: string;

  @OneToOne(()=>AttachmentT,logo=>logo.id)
  @JoinColumn()
  logo: AttachmentT;

  @OneToOne(()=>SeoSettingsT,seo=>seo.id)
  @JoinColumn()
  seo: SeoSettingsT;

  @OneToOne(()=>GoogleSettingsT,google=>google.id)
  @JoinColumn()
  google?: GoogleSettingsT;

  @OneToOne(()=>FacebookSettingsT,facebook=>facebook.id)
  @JoinColumn()
  facebook?: FacebookSettingsT;

  @OneToOne(()=>AttachmentT,contactDetails=>contactDetails.id)
  @JoinColumn()
  contactDetails: ContactDetails;

  @OneToMany(()=>DeliveryTimeT,deliveryTime=>deliveryTime.id)
  @JoinColumn()
  deliveryTime: DeliveryTimeT[];
}

@Entity('Setting')
export class SettingT extends CoreEntityT {
  @OneToOne(()=>SettingsOptionsT,type=>type.id)
  @JoinColumn()
  options: SettingsOptionsT;
}

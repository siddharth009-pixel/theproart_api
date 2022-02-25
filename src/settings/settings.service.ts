import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { getRepository, Repository } from 'typeorm';
import { AttachmentT } from '../common/entities/attachment.entity';
import { DeliveryTimeT } from '../common/entities/deliveryTime.entity';
import { ShopSocialsT } from '../common/entities/socials.entity';
import { Shipping, ShippingT } from '../shippings/entities/shipping.entity';
import { TaxT } from '../taxes/entities/tax.entity';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { ContactDetails, ContactDetailsT, SeoSettingsT, Setting, SettingsOptions, SettingsOptionsT, SettingT } from './entities/setting.entity';
import settingsJson from './settings.json';

// const settings = plainToClass(Setting, settingsJson);
@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(SettingsOptionsT) private settingsOptionsRepository: Repository<SettingsOptionsT>,
  ) { }
  // private settings: Setting = settings;

  taxRepository = getRepository(TaxT);
  shippingRepository = getRepository(ShippingT)
  attachmentRepositry = getRepository(AttachmentT)
  settingsRepository = getRepository(SettingT)
  seoSettingsRepository = getRepository(SeoSettingsT)
  contactDetailsRepository = getRepository(ContactDetailsT)
  shopSocialsRepository = getRepository(ShopSocialsT)
  deliveryTimeRepository = getRepository(DeliveryTimeT)

  async create(createSettingDto: any) {
    // console.log('createSettingDto', createSettingDto)
    console.log('options', createSettingDto?.options)
    let setting = await this.settingsRepository.findOne()
    if (!setting) {
      const setting = new SettingT();
      const settingsOptions = new SettingsOptionsT();
      settingsOptions.siteTitle = createSettingDto?.options?.siteTitle;
      settingsOptions.siteSubtitle = createSettingDto?.options?.siteSubtitle;
      settingsOptions.currency = createSettingDto?.options?.currency;
      settingsOptions.minimumOrderAmount = createSettingDto?.options?.minimumOrderAmount;
      await this.settingsOptionsRepository.save(settingsOptions);

      if (createSettingDto?.options?.taxClass) {
        const taxClass = await this.taxRepository.findOne(createSettingDto?.options?.taxClass)
        settingsOptions.taxClass = taxClass
      }
      if (createSettingDto?.options?.shippingClass) {
        const shippingClass = await this.shippingRepository.findOne(createSettingDto?.options?.shippingClass)
        settingsOptions.shippingClass = shippingClass
      }
      if (createSettingDto?.options?.logo) {
        if (createSettingDto?.options?.logo?.id) {
          delete createSettingDto?.options?.logo?.id
        }
        const att = await this.attachmentRepositry.save({
          ...createSettingDto?.options?.logo,
        })
        settingsOptions.logo = att
      }
      if (createSettingDto?.options?.seo) {
        const seo = await this.seoSettingsRepository.save({
          ...createSettingDto?.options?.seo
        })
        settingsOptions.seo = seo
      }

      // console.log('options socials', createSettingDto?.options?.contactDetails?.socials)

      if (createSettingDto?.options?.contactDetails) {
        let contactDetails = new ContactDetailsT()
        contactDetails.contact = createSettingDto?.options?.contactDetails?.contact
        contactDetails.website = createSettingDto?.options?.contactDetails?.website
        await this.contactDetailsRepository.save(contactDetails)
        if (createSettingDto?.options?.contactDetails?.socials && createSettingDto?.options?.contactDetails?.socials.length > 0) {
          createSettingDto?.options?.contactDetails?.socials.map((async social => {
            let soc = new ShopSocialsT()
            soc.icon = social.icon,
              soc.url = social.url
            await this.shopSocialsRepository.save({
              ...soc,
              contact: contactDetails
            })
          }))
        }
        settingsOptions.contactDetails = contactDetails;
      }

      // if (createSettingDto?.options?.deliveryTime && createSettingDto?.options?.deliveryTime.length > 0) {
      //   createSettingDto?.options?.deliveryTime.map((async time => {
      //     let deliveryTime = new DeliveryTimeT()
      //     deliveryTime.title = time.title;
      //     deliveryTime.description = time.description;
      //     // deliveryTime.settingsOptions = settingsOptions
      //     await this.deliveryTimeRepository.save(deliveryTime)
      //   }))
      // }
      await this.settingsOptionsRepository.save(settingsOptions)
      setting.options = settingsOptions
      const date = new Date()
      setting.created_at=date
      await this.settingsRepository.save(setting);
      return setting;
    }
    else { //if settings has already placed
      const updateSettingDto = createSettingDto;
      // const setting = new SettingT();
      const settingsOptions = await this.settingsOptionsRepository.findOne({ id: setting?.options?.id });
      // const settingsOptions = new SettingsOptionsT();
      console.log('settingsOptions', settingsOptions);
      settingsOptions.siteTitle = updateSettingDto?.options?.siteTitle;
      settingsOptions.siteSubtitle = updateSettingDto?.options?.siteSubtitle;
      settingsOptions.currency = updateSettingDto?.options?.currency;
      settingsOptions.minimumOrderAmount = updateSettingDto?.options?.minimumOrderAmount;
      await this.settingsOptionsRepository.update({ id: setting?.options?.id }, settingsOptions);

      if (updateSettingDto?.options?.taxClass) {
        const taxClass = await this.taxRepository.findOne(updateSettingDto?.options?.taxClass)
        settingsOptions.taxClass = taxClass
      }
      if (updateSettingDto?.options?.shippingClass) {
        const shippingClass = await this.shippingRepository.findOne(updateSettingDto?.options?.shippingClass)
        settingsOptions.shippingClass = shippingClass
      }


      if (updateSettingDto?.options?.logo) {
        if (updateSettingDto?.options?.logo?.id) {
          delete updateSettingDto?.options?.logo?.id
        }
        const oldLogo = await this.attachmentRepositry.findOne({ id: setting.options.logo.id })
        if (oldLogo) {
          await this.attachmentRepositry.remove(oldLogo)
        }
        const att = await this.attachmentRepositry.save({
          ...updateSettingDto?.options?.logo,
        })
        settingsOptions.logo = att
      }



      if (updateSettingDto?.options?.seo) {
        let oldSeo = await this.seoSettingsRepository.findOne({ id: setting?.options?.seo?.id })
        if (oldSeo) {
          await this.seoSettingsRepository.update({ id: oldSeo.id }, {
            ...updateSettingDto?.options?.seo
          })
          settingsOptions.seo = oldSeo
        } else {
          const seo = await this.seoSettingsRepository.save({
            ...createSettingDto?.options?.seo
          })
          settingsOptions.seo = seo
        }
      }

      // console.log('options socials', createSettingDto?.options?.contactDetails?.socials)
      console.log('ns1')
      if (updateSettingDto?.options?.contactDetails) {
        let oldContactDetails = await this.contactDetailsRepository.findOne({ id: setting?.options?.contactDetails?.id })
        if (oldContactDetails) {
          await this.contactDetailsRepository.remove(oldContactDetails)
        }
        let contactDetails = new ContactDetailsT()
        contactDetails.contact = updateSettingDto?.options?.contactDetails?.contact
        contactDetails.website = updateSettingDto?.options?.contactDetails?.website
        await this.contactDetailsRepository.save(contactDetails)
        if (updateSettingDto?.options?.contactDetails?.socials && updateSettingDto?.options?.contactDetails?.socials.length > 0) {
          updateSettingDto?.options?.contactDetails?.socials.map((async social => {
            let soc = new ShopSocialsT()
            soc.icon = social.icon,
              soc.url = social.url
            await this.shopSocialsRepository.save({
              ...soc,
              contact: contactDetails
            })
          }))
        }
        settingsOptions.contactDetails = contactDetails;
      }
      console.log('ns2')



      // console.log('updateSettingDto', updateSettingDto);
      // if (updateSettingDto?.options?.deliveryTime && updateSettingDto?.options?.deliveryTime.length > 0) {
      //   const oldDeliverTimes = await this.deliveryTimeRepository.find({ settingsOptions: settingsOptions })
      //   if (oldDeliverTimes && oldDeliverTimes.length > 0) {
      //     oldDeliverTimes.map(async time => {
      //       await this.deliveryTimeRepository.remove(time)
      //     })
      //   }

      //   // if (settingsOptions.deliveryTime && settingsOptions.deliveryTime.length > 0) {
      //   //   settingsOptions.deliveryTime.map(async time => {
      //   //     await this.deliveryTimeRepository.remove(time);
      //   //   })
      //   // }
      //   console.log('npe1')
      //   updateSettingDto?.options?.deliveryTime.map((async time => {
      //     let deliveryTime = new DeliveryTimeT()
      //     deliveryTime.title = time.title;
      //     deliveryTime.description = time.description;
      //     deliveryTime.settingsOptions = settingsOptions
      //     await this.deliveryTimeRepository.save(deliveryTime)
      //   }))
      // }

      console.log('npe2')
      await this.settingsOptionsRepository.save(settingsOptions)
      setting.options = settingsOptions
      await this.settingsRepository.save(setting);
      console.log('npe3')
      return setting;
      // await this.settingsOptionsRepository.update({ id: setting?.options?.id }, settingsOptions)
      // setting.options = settingsOptions
      // await this.settingsRepository.update({ id: setting?.id }, setting);


      return setting;

    }
  }

  async findAll() {
    return await this.settingsRepository.findOne();
  }

  async findOne(id: number) {
    return await this.settingsRepository.findOne({ id: id });
    return `This action returns a #${id} setting`;
  }

  update(id: number, updateSettingDto: UpdateSettingDto) {
    return;
  }

  remove(id: number) {
    return `This action removes a #${id} setting`;
  }
}

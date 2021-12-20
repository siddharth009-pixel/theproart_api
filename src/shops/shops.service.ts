import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { Shop, ShopT } from './entities/shop.entity';
import shopsJson from './shops.json';
import Fuse from 'fuse.js';
import { GetShopsDto } from './dto/get-shops.dto';
import { paginate } from 'src/common/pagination/paginate';
import { GetStaffsDto } from './dto/get-staffs.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';
import {
  PaymentInfoT,
  shop_cover,
  shop_logos,
} from 'src/common/entities/attachment.entity';
import { BalanceT } from 'src/common/entities/balance.entity';
import { ShopSettingsT } from 'src/common/entities/shopsetting.entity';
import { ShopAddress } from 'src/addresses/entities/address.entity';
import { UserT } from 'src/users/entities/user.entity';

const shops = plainToClass(Shop, shopsJson);
const options = {
  keys: ['name', 'type.slug', 'is_active'],
  threshold: 0.3,
};
@Injectable()
export class ShopsService {
  private shops: Shop[] = shops;

  constructor(
    @InjectRepository(ShopT) private shopRepository: Repository<ShopT>,
  ) {}

  shoplogosRepository = getRepository(shop_logos);
  shopcoverRepository = getRepository(shop_cover);
  balanaceRepository = getRepository(BalanceT);
  paymentInfoRepository = getRepository(PaymentInfoT);
  shopSettinRepository = getRepository(ShopSettingsT);
  shopAddressRepository = getRepository(ShopAddress);
  userRepositoy = getRepository(UserT);

  async create(createShopDto: CreateShopDto, user_id: number) {
    const user = await this.userRepositoy.findOne({ id: user_id });
    const shop = new ShopT();
    shop.owner = user;
    // shop.owner_id = user_id;
    shop.name = createShopDto?.name;
    shop.description = createShopDto?.description;
    shop.slug = createShopDto?.name + 'slug';
    if (createShopDto?.logo) {
      delete createShopDto.logo.id;
      const shopLogo = await this.shoplogosRepository.save({
        ...createShopDto.logo,
      });
      shop.logo = shopLogo;
    }
    if (createShopDto?.cover_image) {
      delete createShopDto.cover_image.id;
      const cover_image = await this.shopcoverRepository.save({
        ...createShopDto.cover_image,
      });
      shop.cover_image = cover_image;
    }
    if (createShopDto?.balance) {
      let payment_info;
      const balance = new BalanceT();
      if (createShopDto?.balance?.payment_info) {
        payment_info = await this.paymentInfoRepository.save({
          ...createShopDto.balance.payment_info,
        });
        balance.payment_info = payment_info;
      }
      balance.admin_commission_rate = createShopDto.balance
        ?.admin_commission_rate
        ? createShopDto.balance?.admin_commission_rate
        : 20;
      balance.withdrawn_amount = createShopDto.balance?.withdrawn_amount
        ? createShopDto.balance?.withdrawn_amount
        : 0;
      balance.current_balance = createShopDto.balance?.current_balance
        ? createShopDto.balance?.current_balance
        : 100;
      balance.total_earnings = createShopDto.balance?.total_earnings
        ? createShopDto.balance?.total_earnings
        : 0;
      shop.balance = await this.balanaceRepository.save(balance);
    }
    if (createShopDto?.address) {
      const address = await this.shopAddressRepository.save({
        ...createShopDto.address,
      });
      shop.address = address;
    }
    if (createShopDto?.settings) {
      if (Object.keys(createShopDto?.settings?.location).length <= 0)
        delete createShopDto.settings.location;
      if (createShopDto?.settings?.socials.length < 0)
        delete createShopDto.settings.socials;
      const setting = await this.shopSettinRepository.save({
        ...createShopDto.settings,
      });
      shop.settings = setting;
    }
    const shopfinal = await this.shopRepository.save(shop);
    return shopfinal;
  }

  async getShops({ search, limit, page }: GetShopsDto) {
    if (!page) page = 1;
    // const user = await this.userRepositoy.findOne({ id: id });
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    let data: ShopT[] = await this.shopRepository.find();
    // let data: Shop[] = this.shops;
    if (search) {
      const parseSearchParams = search.split(';');
      for (const searchParam of parseSearchParams) {
        const [key, value] = searchParam.split(':');
        const fuse = new Fuse(data, options);
        // const fuse = new Fuse(shops, options);
        data = data.filter((item) => item[key] === value);
        data = fuse.search(value)?.map(({ item }) => item);
      }
    }

    const results = data.slice(startIndex, endIndex);
    const url = `/shops?search=${search}&limit=${limit}`;

    return {
      data: results,
      ...paginate(data.length, page, limit, results.length, url),
    };
  }
  getStaffs({ shop_id, limit, page }: GetStaffsDto) {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    let staffs: Shop['staffs'] = [];
    if (shop_id) {
      staffs = this.shops.find((p) => p.id === Number(shop_id))?.staffs ?? [];
    }
    const results = staffs?.slice(startIndex, endIndex);
    const url = `/staffs?limit=${limit}`;

    return {
      data: results,
      ...paginate(staffs?.length, page, limit, results?.length, url),
    };
  }

  async getShop(slug: string): Promise<ShopT> {
    const shop = await this.shopRepository.findOne({ slug: slug });
    return shop;
  }

  async update(id: number, updateShopDto: UpdateShopDto) {
    console.log(updateShopDto);
    const shop = await this.shopRepository.findOne({ id: id });
    shop.name = updateShopDto?.name;
    shop.description = updateShopDto?.description;
    //update logo image
    if (updateShopDto?.logo) {
      let shopLogo;
      delete updateShopDto.logo.id;
      const shoplogodb = await this.shoplogosRepository.findOne({
        shop_logo: shop,
      });
      if (shoplogodb) {
        shopLogo = await this.shoplogosRepository.update(
          { shop_logo: shop },
          {
            ...updateShopDto.logo,
          },
        );
      } else {
        shopLogo = await this.shoplogosRepository.save({
          ...updateShopDto.logo,
        });
      }
      shop.logo = shopLogo;
    }
    //update cover image
    if (updateShopDto?.cover_image) {
      let cover_image_local;
      delete updateShopDto.logo.id;
      const shoplogodb = await this.shopcoverRepository.findOne({
        shop_cover: shop,
      });
      if (shoplogodb) {
        cover_image_local = await this.shopcoverRepository.update(
          { shop_cover: shop },
          {
            ...updateShopDto.cover_image,
          },
        );
      } else {
        cover_image_local = await this.shopcoverRepository.save({
          ...updateShopDto.cover_image,
        });
      }
      shop.cover_image = cover_image_local;
    }
    //update shop address
    if (updateShopDto?.address) {
      let address;
      const addressdb = await this.shopAddressRepository.findOne({
        shop: shop,
      });
      if (addressdb) {
        address = await this.shopAddressRepository.update(
          { shop: shop },
          {
            ...updateShopDto.address,
          },
        );
      } else {
        address = await this.shopAddressRepository.save({
          ...updateShopDto.address,
        });
      }
      shop.address = address;
    }
    //update balnace and payment info
    if (updateShopDto?.balance) {
      let payment_info;
      const balance = await this.balanaceRepository.findOne({ shop: shop });
      if (balance) {
        payment_info = await this.paymentInfoRepository.update(
          { balance: balance },
          {
            ...updateShopDto.balance.payment_info,
          },
        );
        balance.payment_info = payment_info;
        shop.balance = await this.balanaceRepository.save(balance);
      } else {
        if (updateShopDto?.balance?.payment_info) {
          payment_info = await this.paymentInfoRepository.save({
            ...updateShopDto.balance.payment_info,
          });
          balance.payment_info = payment_info;
        }
        balance.admin_commission_rate = updateShopDto.balance
          ?.admin_commission_rate
          ? updateShopDto.balance?.admin_commission_rate
          : 20;
        balance.withdrawn_amount = updateShopDto.balance?.withdrawn_amount
          ? updateShopDto.balance?.withdrawn_amount
          : 0;
        balance.current_balance = updateShopDto.balance?.current_balance
          ? updateShopDto.balance?.current_balance
          : 100;
        balance.total_earnings = updateShopDto.balance?.total_earnings
          ? updateShopDto.balance?.total_earnings
          : 0;
        shop.balance = await this.balanaceRepository.save(balance);
      }
    }
    const shopfinal = await this.shopRepository.save(shop);
    return shopfinal;
    /*
    //Update Setting of Shop
    if (updateShopDto?.settings) {
      if (Object.keys(updateShopDto?.settings?.location).length <= 0)
        delete updateShopDto.settings.location;
      if (updateShopDto?.settings?.socials.length < 0)
        delete updateShopDto.settings.socials;
      const shopSettting = await this.shopSettinRepository.findOne({
        shop: shop,
      });
      let setting;
      if (shopSettting) {
        setting = await this.shopSettinRepository.update(
          { shop: shop },
          {
            ...updateShopDto.settings,
          },
        );
      } else {
        setting = await this.shopSettinRepository.save({
          ...updateShopDto.settings,
        });
      }
      shop.settings = setting;
    } 
*/
    //Update Address
  }

  approve(id: number) {
    return `This action removes a #${id} shop`;
  }
  remove(id: number) {
    return `This action removes a #${id} shop`;
  }
}

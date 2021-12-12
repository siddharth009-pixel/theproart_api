import { Injectable } from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { CouponT } from './entities/coupon.entity';
import { GetCouponsDto } from './dto/get-coupons.dto';
import { paginate } from 'src/common/pagination/paginate';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';
import { CouponAttachment } from 'src/common/entities/attachment.entity';

@Injectable()
export class CouponsService {
  constructor(
    @InjectRepository(CouponT) private couponRepository: Repository<CouponT>,
  ) {}

  couponAttechmantRepository = getRepository(CouponAttachment);
  async create(createCouponDto: CreateCouponDto) {
    const coupne = new CouponT();
    let coupnei;
    if (createCouponDto?.image) {
      delete createCouponDto?.image.id;
      coupnei = await this.couponAttechmantRepository.save({
        ...createCouponDto.image,
      });
      coupne.image = coupnei;
    }
    coupne.code = createCouponDto?.code;
    coupne.description = createCouponDto?.description;
    coupne.expire_at = createCouponDto?.expire_at;
    coupne.active_from = createCouponDto?.active_from;
    coupne.amount = createCouponDto?.amount;
    await this.couponRepository.save(coupne);
    return coupne;
  }

  async getCoupons({ search, limit, page }: GetCouponsDto) {
    if (!page) page = 1;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const data: CouponT[] = await this.couponRepository.find();

    const results = data.slice(startIndex, endIndex);
    const url = `/coupons?search=${search}&limit=${limit}`;
    return {
      data: results,
      ...paginate(data.length, page, limit, results.length, url),
    };
  }

  async getCoupon(id: number) {
    const coupon = await this.couponRepository.findOne({ id: id });
    console.log(coupon);
    return coupon;
  }

  async update(id: number, updateCouponDto: UpdateCouponDto) {
    let coupne = await this.couponRepository.findOne({ id: id });
    if (updateCouponDto?.image) {
      delete updateCouponDto?.image.id;
      await this.couponAttechmantRepository.update(
        { coupon_image: coupne },
        {
          ...updateCouponDto.image,
        },
      );
    }
    coupne.code = updateCouponDto?.code;
    coupne.description = updateCouponDto?.description;
    coupne.expire_at = updateCouponDto?.expire_at;
    coupne.active_from = updateCouponDto?.active_from;
    coupne.amount = updateCouponDto?.amount;
    coupne = await this.couponRepository.save(coupne);
    return coupne;
  }

  async remove(id: number) {
    const coupne = await this.couponRepository.findOne({ id: id });
    if (coupne) return this.couponRepository.remove(coupne);
  }
}

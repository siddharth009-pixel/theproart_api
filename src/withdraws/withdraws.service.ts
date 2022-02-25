import { Injectable } from '@nestjs/common';
import { CreateWithdrawDto } from './dto/create-withdraw.dto';
import { ApproveWithdrawDto } from './dto/approve-withdraw.dto';
import { Withdraw, WithdrawStatus, WithdrawT } from './entities/withdraw.entity';
import { GetWithdrawsDto, WithdrawPaginator } from './dto/get-withdraw.dto';
import { paginate } from 'src/common/pagination/paginate';
import { getRepository, Repository } from 'typeorm';
import { ShopT } from '../shops/entities/shop.entity';
import { BalanceT } from '../common/entities/balance.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class WithdrawsService {
  constructor(
    @InjectRepository(WithdrawT) private withdrawRepository: Repository<WithdrawT>,
  ) { }
  private withdraws: Withdraw[] = [];

  // withdrawRepository = getRepository(WithdrawT)
  shopRepository = getRepository(ShopT)
  balanceRepository = getRepository(BalanceT)

  async create(createWithdrawDto: CreateWithdrawDto, id) {
    let withdraw = new WithdrawT();
    withdraw.amount = createWithdrawDto?.amount;
    withdraw.note = createWithdrawDto?.note;
    withdraw.details = createWithdrawDto?.details
    withdraw.payment_method = createWithdrawDto?.payment_method

    const shop = await this.shopRepository.findOne({ id: createWithdrawDto?.shop_id })
    if (shop) {
      let isValid = false;
      let balance = shop?.balance;
      if (balance.current_balance >= createWithdrawDto?.amount) {
        isValid = true;
      }
      if (isValid) {
        withdraw.status = WithdrawStatus.PENDING;
      } else {
        withdraw.status = WithdrawStatus.REJECTED;
      }
      withdraw.shop_id = shop.id
      withdraw.shop = shop
      const date = new Date()
      withdraw.created_at = date
      return await this.withdrawRepository.save(withdraw)
    } else {
      return;
    }

  }

  async getWithdraws({
    limit,
    page,
    status,
    shop_id,
  }: GetWithdrawsDto): Promise<WithdrawPaginator> {
    if (!page) page = 1;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    let data = []
    // if (shop_id) {
    //   // data = this.withdraws.filter((p) => p.shop_id === shop_id);
    //   data = await this.withdrawRepository.find({ shop_id: shop_id });
    // } else {
    //   data = await this.withdrawRepository.find({})
    // }
    
      data = await this.withdrawRepository.find({ shop_id: shop_id });
    
    const results = data.slice(startIndex, endIndex);
    const url = `/withdraws?limit=${limit}`;
    return {
      data: results,
      ...paginate(data.length, page, limit, results.length, url),
    };
  }
  async getAllWithdraws({
    limit,
    page,
    status,
    shop_id,
  }: GetWithdrawsDto): Promise<WithdrawPaginator> {
    if (!page) page = 1;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    let data = []
      data = await this.withdrawRepository.find({})
    
    const results = data.slice(startIndex, endIndex);
    const url = `/withdraws?limit=${limit}`;
    return {
      data: results,
      ...paginate(data.length, page, limit, results.length, url),
    };
  }

  async findOne(id: number) {
    return await this.withdrawRepository.findOne(id)
  }

  // update(id: number, updateWithdrawDto: ApproveWithdrawDto) {
  //   let updateWithdrawDto
  //   return this.withdraws[0];
  // }
  async update(updateWithdrawDto: ApproveWithdrawDto) {
    let {id,status}=updateWithdrawDto;
    return await this.withdrawRepository.update(id,{ status: status})
  }

  remove(id: number) {
    return `This action removes a #${id} withdraw`;
  }
}

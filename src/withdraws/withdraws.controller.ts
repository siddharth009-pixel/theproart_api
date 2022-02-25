import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { WithdrawsService } from './withdraws.service';
import { CreateWithdrawDto } from './dto/create-withdraw.dto';
import { ApproveWithdrawDto } from './dto/approve-withdraw.dto';
import { GetWithdrawsDto, WithdrawPaginator } from './dto/get-withdraw.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Controller('withdraws')
@ApiTags('Withdraws')
export class WithdrawsController {
  constructor(private readonly withdrawsService: WithdrawsService) { }

  @Post()
  @UseGuards(AuthGuard())
  createWithdraw(@Body() createWithdrawDto: CreateWithdrawDto, @Req() req) {
    const id = req?.user?.payload?.id;
    return this.withdrawsService.create(createWithdrawDto, id);
  }

  @Get()
  async withdraws(@Query() query: GetWithdrawsDto): Promise<WithdrawPaginator> {
    let {shop_id}=query
    console.log('shop_id',shop_id);
    if(shop_id && shop_id>0){
      console.log('hello');
      return this.withdrawsService.getWithdraws(query);    
    }
    return this.withdrawsService.getAllWithdraws(query);
  }

  @Get(':id')
  withdraw(@Param('id') id: string) {
    return this.withdrawsService.findOne(+id);
  }

  // @Post(':id/approve')
  // approveWithdraw(
  //   @Param('id') id: string,
  //   @Body() updateWithdrawDto: ApproveWithdrawDto,
  // ) {
  //   return this.withdrawsService.update(+id, updateWithdrawDto);
  // }

  @Post('approve-withdraw')
  approveWithdraw(@Body() updateWithdrawDto: ApproveWithdrawDto,
  ) {
    return this.withdrawsService.update(updateWithdrawDto);
  }


  @Delete(':id')
  deleteWithdraw(@Param('id') id: number) {
    return this.withdrawsService.remove(+id);
  }
}

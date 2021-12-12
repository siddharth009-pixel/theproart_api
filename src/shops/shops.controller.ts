import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ShopsService } from './shops.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { GetShopsDto, ShopPaginatorT } from './dto/get-shops.dto';
import { GetStaffsDto } from './dto/get-staffs.dto';
import { UserPaginator } from 'src/users/dto/get-users.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
@Controller('shops')
@ApiTags('Shops')
export class ShopsController {
  constructor(private readonly shopsService: ShopsService) {}

  @Post()
  @UseGuards(AuthGuard())
  create(@Body() createShopDto: CreateShopDto, @Req() req) {
    console.log(req.user.payload.id);
    return this.shopsService.create(createShopDto, req.user.payload.id);
  }

  @Get()
  @UseGuards(AuthGuard())
  async getShops(
    @Query() query: GetShopsDto,
    @Req() req,
  ): Promise<ShopPaginatorT> {
    return this.shopsService.getShops(query, req.user.payload.id);
  }

  @Get(':slug')
  async getShop(@Param('slug') slug: string) {
    return this.shopsService.getShop(slug);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateShopDto: UpdateShopDto) {
    return this.shopsService.update(+id, updateShopDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shopsService.remove(+id);
  }
  @Post('approve')
  approveShop(@Param('id') id: string) {
    return this.shopsService.approve(+id);
  }
  @Post('disapprove')
  disapproveShop(@Param('id') id: string) {
    return this.shopsService.approve(+id);
  }
}
@Controller('staffs')
@ApiTags('staffs')
export class StaffsController {
  constructor(private readonly shopsService: ShopsService) {}

  @Post()
  create(@Body() createShopDto: CreateShopDto) {
    return this.shopsService.create(createShopDto, 1);
  }

  @Get()
  async getStaffs(@Query() query: GetStaffsDto): Promise<UserPaginator> {
    return this.shopsService.getStaffs(query);
  }

  @Get(':slug')
  async getShop(@Param('slug') slug: string) {
    return this.shopsService.getShop(slug);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateShopDto: UpdateShopDto) {
    return this.shopsService.update(+id, updateShopDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shopsService.remove(+id);
  }
}

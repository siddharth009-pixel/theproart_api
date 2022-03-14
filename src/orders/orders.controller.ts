import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import {
  GetOrdersDto,
  OPPivotPaginatorT,
  OrderPaginator,
  OrderPaginatorT,
} from './dto/get-orders.dto';
import {
  CreateOrderStatusDto,
  UpdateOrderStatusDto,
} from './dto/create-order-status.dto';
import { GetOrderStatusesDto } from './dto/get-order-statuses.dto';
import { CheckoutVerificationDto } from './dto/verify-checkout.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

@Controller('orders')
@ApiTags('Orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('create/orderId')
  createOrderId(@Body() createOrderIdDto: any,@Res({passthrough: true}) response: Response){
    return this.ordersService.createOrderId(createOrderIdDto,response)
  }

  @Post('payment/verify')
  verifyPayment(@Body() paymentData:any,@Res({passthrough: true}) response: Response){
    return this.ordersService.verifyPayment(paymentData,response)
  }

  @Post()
  @UseGuards(AuthGuard())
  create(@Body() createOrderDto: CreateOrderDto, @Req() req) {
    const payload = req?.user?.payload;
    return this.ordersService.create(createOrderDto, payload);
  }

  @Get()
  async getOrders(@Query() query: GetOrdersDto) {
    return this.ordersService.getOrders(query);
  }
  
  @Get('customer')
  @UseGuards(AuthGuard())
  async getCustomerOrders(@Query() query: GetOrdersDto,@Req() req): Promise<OrderPaginatorT> {    
    const id = req?.user?.payload?.id;
    return this.ordersService.getCustomerOrders(query,id);
  }

  @Get('shop')
  @UseGuards(AuthGuard())
  async getShopOrders(@Query() query: GetOrdersDto,@Req() req): Promise<OPPivotPaginatorT> {    
    const id = req?.user?.payload?.id;
    return this.ordersService.getShopOrders(query,id);
  }

  @Get(':id')
  getOrderById(@Param('id') id: string) {
    return this.ordersService.getOrderById(+id);
  }

  
  @Get('orderspivot/:id')
  getOrderPivotById(@Param('id') id: string) {
    return this.ordersService.getOrderPivotById(+id);
  }

  @Put('orders-products-pivot/:id')
  updateOrderPivot(@Param('id') id: string, @Body() updateOrderPivotDto: any) {
    return this.ordersService.updateOrderPivot(+id, updateOrderPivotDto);
  }


  @Get('tracking-number/:tracking_id')
  getOrderByTrackingNumber(@Param('tracking_id') tracking_id: string) {
    return this.ordersService.getOrderByTrackingNumber(tracking_id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }

  @Post('checkout/verify')
  verifyCheckout(@Query() query: CheckoutVerificationDto) {
    return this.ordersService.verifyCheckout(query);
  }
}

@Controller('order-status')
@ApiTags('order-status')
export class OrderStatusController {
  constructor(private readonly ordersService: OrdersService) {}
  @Post()
  create(@Body() createOrderStatusDto: CreateOrderStatusDto) {
    return this.ordersService.createOrderStatus(createOrderStatusDto);
  }

  @Get()
  findAll(@Query() query: GetOrderStatusesDto) {
    return this.ordersService.getOrderStatuses(query);
  }

  @Get('user')
  findAllStatus() {
    return this.ordersService.getUserOrderStatuses();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.ordersService.getOrderStatus(slug);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateOrderStatus(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.removeOrderStatus(+id);
  }
}

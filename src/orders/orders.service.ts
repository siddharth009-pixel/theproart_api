import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { GetOrdersDto } from './dto/get-orders.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderT } from './entities/order.entity';
import { OrderStatusT } from './entities/order-status.entity';
import { paginate } from 'src/common/pagination/paginate';
import {
  GetOrderStatusesDto,
  OrderStatusPaginatorT,
} from './dto/get-order-statuses.dto';
import {
  CheckoutVerificationDto,
  VerifiedCheckoutData,
} from './dto/verify-checkout.dto';
import {
  CreateOrderStatusDto,
  UpdateOrderStatusDto,
} from './dto/create-order-status.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, getRepository, Repository } from 'typeorm';
import { UserT } from 'src/users/entities/user.entity';
import { CouponT } from 'src/coupons/entities/coupon.entity';
import { UserAddressT } from 'src/addresses/entities/address.entity';
import { ProductT } from 'src/products/entities/product.entity';
import { OrderProductPivotT } from 'src/common/entities/orderproductpivot.entity';
import { ShopT } from '../shops/entities/shop.entity';
import * as Razorpay from 'razorpay';
import { InjectRazorpay } from 'nestjs-razorpay';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderT) private orderRepository: Repository<OrderT>,
    @InjectRazorpay() private readonly razorpayClient: any,
    // @InjectRazorpay() private readonly razorpayClient: Razorpay,
  ) {}

  options = {
    amount: 50000, // amount in the smallest currency unit
    currency: 'INR',
    receipt: 'order_rcptid_11',
  };
  run() {
    this.razorpayClient.orders.create(this.options, function (err, orders) {
      console.log(orders);
    });
  }
  // instance = new Razorpay({  key_id: `${process.env.RAZORPAY_KEY_ID}`,  key_secret: `${process.env.RAZORPAY_KEY_SECRET}`,});
  // options:any = {
  //   amount: 50000,  // amount in the smallest currency unit
  //   currency: "INR",
  //   receipt: "order_rcptid_11"
  // };
  // instance.orders.create(this.options, function(err, order) {
  //   console.log(order);
  // });

  userRepository = getRepository(UserT);
  couponRepository = getRepository(CouponT);
  useraddressRepository = getRepository(UserAddressT);
  productRepository = getRepository(ProductT);
  orderStatusRepository = getRepository(OrderStatusT);
  orderProductPivotRepository = getRepository(OrderProductPivotT);
  shopRepository = getRepository(ShopT);
  
  async createOrderId(createOrderIdDto:any){
    let options = {
      amount: createOrderIdDto.amount, // amount in the smallest currency unit
      currency: 'INR',
      receipt: 'order_rcptid_11',
    };
    this.razorpayClient.orders.create(options, function (err, order) {
      console.log('order',order);
      if(err) {
        console.log('err',err);
        return false;
      }
      console.log('order----id',order.id);
      return {orderId:order.id}
      
    });
  }

  async create(createOrderInput: CreateOrderDto, payload: UserT) {
    console.log('createOrderInput', createOrderInput);
    const order = new OrderT();
    order.tracking_number = Math.floor(Math.random() * 1000000 + 1).toString();

    order.customer_id = payload.id;
    order.customer_contact = createOrderInput.customer_contact;
    const user = await this.userRepository.findOne({ id: payload.id });
    order.customer = user;

    order.amount = createOrderInput?.amount;
    order.sales_tax = createOrderInput?.sales_tax;
    order.total = createOrderInput?.total;
    order.paid_total = createOrderInput?.paid_total;
    order.discount = createOrderInput?.discount;
    order.delivery_fee = createOrderInput?.delivery_fee;
    order.delivery_time = createOrderInput?.delivery_time;
    // order.payment_gateway = createOrderInput?.payment_gateway;

    if (createOrderInput?.coupon_id) {
      const coupon = await this.couponRepository.findOne({
        id: createOrderInput?.coupon_id,
      });
      order.coupon = coupon;
    }
    if (createOrderInput?.shipping_address) {
      const address = await this.useraddressRepository.findOne({
        id: createOrderInput?.shipping_address['id'],
      });
      order.shipping_address = address;
    }
    if (createOrderInput?.billing_address) {
      const address = await this.useraddressRepository.findOne({
        id: createOrderInput?.shipping_address['id'],
      });
      order.billing_address = address;
    }
    // if (createOrderInput?.status) {
    //   const status = await this.orderStatusRepository.findOne({
    //     id: +createOrderInput?.status,
    //   });
    //   order.status = status;
    // }
    await this.orderRepository.save(order);
    if (createOrderInput?.products) {
      createOrderInput?.products.map(async (product) => {
        const orderProductPivot = new OrderProductPivotT();
        orderProductPivot.order_id = order.id;
        orderProductPivot.order = order;
        orderProductPivot.order_quantity = product.order_quantity;
        const initStatus = await this.orderStatusRepository.findOne({
          serial: 1,
        });
        orderProductPivot.status = initStatus;

        orderProductPivot.product_id = product.product_id;
        const prod = await this.productRepository.findOne(product.product_id);
        // orderProductPivot.product = prod;
        orderProductPivot.pivot = prod;

        await this.orderProductPivotRepository.save(orderProductPivot);

        console.log('product', prod);
        orderProductPivot.shop_id = prod.shop_id;
        const shopp = await this.shopRepository.findOne(prod.shop_id);
        orderProductPivot.shop = shopp;
        console.log('shop', shopp);

        await this.orderProductPivotRepository.save(orderProductPivot);

        orderProductPivot.deducted = false;
        orderProductPivot.unit_price = product.unit_price;
        orderProductPivot.subtotal = product.subtotal;

        await this.orderProductPivotRepository.save(orderProductPivot);
        const { quantity } = await this.productRepository.findOne({
          id: product.product_id,
        });
        await this.productRepository.update(
          { id: product.product_id },
          {
            quantity: quantity - product.order_quantity,
          },
        );
        await getConnection()
          .createQueryBuilder()
          .relation(OrderT, 'products')
          .of(order)
          .add(product.product_id);
      });
    }
    return order;
  }

  async getCustomerOrders(
    { limit, page, customer_id, tracking_number, search, shop_id }: any,
    id: any,
  ) {
    if (!page) page = 1;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    let customer = await this.userRepository.findOne(id);
    let data = await this.orderRepository.find({ customer_id: customer.id });
    const results = data.slice(startIndex, endIndex);
    const url = `/orders?search=${search}&limit=${limit}`;
    return {
      data: results,
      ...paginate(data.length, page, limit, results.length, url),
    };
  }

  async getShopOrders(
    { limit, page, customer_id, tracking_number, search, shop_id }: any,
    id: any,
  ) {
    if (!page) page = 1;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    let customer = await this.userRepository.findOne(id);
    let shop = await customer.shops;
    let data = await this.orderProductPivotRepository.find({
      shop_id: shop.id,
    });
    // let data1 = await this.orderRepository.find({ customer_id: customer.id })
    const results = data.slice(startIndex, endIndex);
    const url = `/orders?search=${search}&limit=${limit}`;
    return {
      data: results,
      ...paginate(data.length, page, limit, results.length, url),
    };
  }

  async getOrders({
    limit,
    page,
    customer_id,
    tracking_number,
    search,
    shop_id,
  }: GetOrdersDto) {
    if (!page) page = 1;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    let data = await this.orderRepository.find();
    const results = data.slice(startIndex, endIndex);
    const url = `/orders?search=${search}&limit=${limit}`;
    return {
      data: results,
      ...paginate(data.length, page, limit, results.length, url),
    };
  }

  async getOrderById(id: number) {
    return await this.orderRepository.findOne({ id });
  }

  async getOrderPivotById(id: number) {
    return await this.orderProductPivotRepository.findOne({ id });
    // return await this.orderProductPivotRepository.findOne({ id });
  }

  async getOrderByTrackingNumber(tracking_number: string) {
    return await this.orderRepository.findOne({
      tracking_number: tracking_number,
    });
    // const parentOrder = this.orders.find(
    //   (p) => p.tracking_number === tracking_number,
    // );

    // if (!parentOrder) {
    //   return this.orders[0];
    // }
    // return parentOrder;
  }

  // async update(id: number, updateOrderInput: UpdateOrderDto) {
  //   if (updateOrderInput?.status) {
  //     const status = await this.orderStatusRepository.findOne({
  //       id: +updateOrderInput?.status,
  //     });
  //     var order = await this.orderRepository.update(id, { status: status });
  //   }
  //   return order;
  // }

  async updateOrderPivot(id: number, updateOrderInput: any) {
    console.log('updateOrderInput', updateOrderInput);
    if (updateOrderInput?.status) {
      const status = await this.orderStatusRepository.findOne({
        id: +updateOrderInput?.status,
      });
      console.log('order-status', status);
      var orderPivot = await this.orderProductPivotRepository.update(id, {
        status: status,
      });
      // var order = await this.orderRepository.update(id, { status: status });
    }
    return orderPivot;
  }

  // async update(id: number, updateOrderInput: UpdateOrderDto) {
  async update(id: number, updateOrderInput) {
    console.log('hhhhhh');
    if (updateOrderInput?.status) {
      const status = await this.orderStatusRepository.findOne({
        id: +updateOrderInput?.status,
      });
      var order = await this.orderRepository.findOne({ id: id });
      order?.orderProductPivot.forEach(async (orderPivot) => {
        await this.orderProductPivotRepository.update(
          { id: orderPivot.id },
          { status: status },
        );
      });
      await this.orderRepository.save(order);
    }
    return order;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  verifyCheckout(input: CheckoutVerificationDto): VerifiedCheckoutData {
    return {
      total_tax: 0,
      shipping_charge: 0,
      unavailable_products: [],
    };
  }
  async createOrderStatus(createOrderStatusInput: CreateOrderStatusDto) {
    const date = new Date();
    const newCreateOrderStatusInput = {
      ...createOrderStatusInput,
      created_at: date,
    };
    return await this.orderStatusRepository.save(createOrderStatusInput);
  }
  async updateOrderStatus(
    id: number,
    updateOrderStatusInput: UpdateOrderStatusDto,
  ) {
    return await this.orderStatusRepository.update(id, updateOrderStatusInput);
  }
  async getOrderStatuses({
    limit,
    page,
    search,
    orderBy,
  }: GetOrderStatusesDto): Promise<OrderStatusPaginatorT> {
    if (!page || page.toString() === 'undefined') page = 1;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const data: OrderStatusT[] = await this.orderStatusRepository.find();

    // if (shop_id) {
    //   data = this.orders?.filter((p) => p?.shop?.id === shop_id);
    // }
    const results = data.slice(startIndex, endIndex);
    const url = `/order-status?search=${search}&limit=${limit}`;

    return {
      data: results,
      ...paginate(data.length, page, limit, results.length, url),
    };
  }
  async getUserOrderStatuses() {
    return await this.orderStatusRepository.find();
  }
  async getOrderStatus(slug: string) {
    return await this.orderStatusRepository.findOne({ name: slug });
  }
  async removeOrderStatus(id: number) {
    const status = await this.orderStatusRepository.findOne({ id });
    return await this.orderStatusRepository.remove(status);
  }
}

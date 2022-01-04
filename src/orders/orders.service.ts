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
@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderT) private orderRepository: Repository<OrderT>,
  ) {}

  userRepository = getRepository(UserT);
  couponRepository = getRepository(CouponT);
  useraddressRepository = getRepository(UserAddressT);
  productRepository = getRepository(ProductT);
  orderStatusRepository = getRepository(OrderStatusT);
  orderProductPivotRepository = getRepository(OrderProductPivotT);

  async create(createOrderInput: CreateOrderDto, payload: UserT) {
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
    if (createOrderInput?.status) {
      const status = await this.orderStatusRepository.findOne({
        id: +createOrderInput?.status,
      });
      order.status = status;
    }
    await this.orderRepository.save(order);
    if (createOrderInput?.products) {
      createOrderInput?.products.map(async (product) => {
        const orderProductPivot = new OrderProductPivotT();
        orderProductPivot.order_id = order.id;
        orderProductPivot.product_id = product.product_id;
        orderProductPivot.order_quantity = product.order_quantity;
        orderProductPivot.order_id = order.id;
        orderProductPivot.unit_price = product.unit_price;
        orderProductPivot.subtotal = product.subtotal;
        await this.orderProductPivotRepository.save(orderProductPivot);
        const { quantity } = await this.productRepository.findOne({
          id: product.product_id,
        });
        await this.productRepository.update(
          { id: product.product_id },
          {
            pivot: orderProductPivot,
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
    let data: OrderT[] = await this.orderRepository.find();

    if (shop_id && shop_id !== 'undefined') {
      data = data?.filter((p) => p?.shop?.id === Number(shop_id));
    }
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
  async update(id: number, updateOrderInput: UpdateOrderDto) {
    if (updateOrderInput?.status) {
      const status = await this.orderStatusRepository.findOne({
        id: +updateOrderInput?.status,
      });
      var order = await this.orderRepository.update(id, { status: status });
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
  async getOrderStatus(slug: string) {
    return await this.orderStatusRepository.findOne({ name: slug });
  }
  async removeOrderStatus(id: number) {
    const status = await this.orderStatusRepository.findOne({ id });
    return await this.orderStatusRepository.remove(status);
  }
}

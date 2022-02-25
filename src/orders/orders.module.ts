import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController, OrderStatusController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderT } from './entities/order.entity';
import { PassportModule } from '@nestjs/passport';
import { RazorpayModule } from 'nestjs-razorpay';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderT]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    RazorpayModule.forRoot({
      key_id: `rzp_test_qwMexyNjiKF0UT`,
      key_secret: `ul8fAx1CTLL5ClfsUIzRWRMx`,
      // key_id: `${process.env.RAZORPAY_KEY_ID}`,
      // key_secret: `${process.env.RAZORPAY_KEY_SECRET}`,
    })
  ],
  controllers: [OrdersController, OrderStatusController],
  providers: [OrdersService],
})
export class OrdersModule {}

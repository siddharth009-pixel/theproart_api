import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { CategoriesModule } from './categories/categories.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { AttributesModule } from './attributes/attributes.module';
import { ShippingsModule } from './shippings/shippings.module';
import { TaxesModule } from './taxes/taxes.module';
import { TagsModule } from './tags/tags.module';
import { ShopsModule } from './shops/shops.module';
import { TypesModule } from './types/types.module';
import { WithdrawsModule } from './withdraws/withdraws.module';
import { UploadsModule } from './uploads/uploads.module';
import { SettingsModule } from './settings/settings.module';
import { CouponsModule } from './coupons/coupons.module';
import { AddressesModule } from './addresses/addresses.module';
import { ImportsModule } from './imports/imports.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactModule } from './contact/contact.module';
import { ConfigModule } from '@nestjs/config';
import { EmailServiceModule } from './email-service/email-service.module';
import { RazorpayModule } from 'nestjs-razorpay';
import path from 'path';
import { getPEMFromSecretsManager } from './aws.utils';
@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    CommonModule,
    ProductsModule,
    OrdersModule,
    CategoriesModule,
    AnalyticsModule,
    AttributesModule,
    ShippingsModule,
    TaxesModule,
    TagsModule,
    ShopsModule,
    TypesModule,
    WithdrawsModule,
    UploadsModule,
    SettingsModule,
    CouponsModule,
    AddressesModule,
    ImportsModule,
    AuthModule,
    EmailServiceModule,
    RazorpayModule.forRoot({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    }),    
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Import ConfigModule if you need env variables
      useFactory: async () => {
        let pemContent;
        try {
          pemContent = await getPEMFromSecretsManager('ssl-theproart');
        } catch (error) {
          console.error("Error fetching PEM from Secrets Manager:", error);
          throw error; // This will prevent the app from starting
        }

        return {
          type: 'postgres',
          host: process.env.DB_HOST,
          port: +process.env.PG_PORT,
          username: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          entities: [path.join(__dirname, '**', '*.entity.{ts,js}')],
          synchronize: process.env.SYNCHRONIZE ? true : false,
          autoLoadEntities: process.env.SYNCHRONIZE ? true : false,
          ssl: {
            ca: pemContent,
            rejectUnauthorized: false
          }
        }
      }
    }),
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: process.env.DB_HOST,
    //   port: +process.env.PG_PORT,
    //   username: process.env.DB_USER,
    //   password: process.env.DB_PASSWORD,
    //   database: process.env.DB_NAME,
    //   entities: [path.join(__dirname, '**', '*.entity.{ts,js}')],
    //   synchronize: process.env.SYNCHRONIZE ? true : false,
    //   autoLoadEntities: process.env.SYNCHRONIZE ? true : false,
    //   ssl: {
    //     ca: pemContent,
    //     rejectUnauthorized: false
    //   },
    // }),
    ContactModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

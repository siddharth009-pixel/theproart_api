import { Module } from '@nestjs/common';
import { WithdrawsService } from './withdraws.service';
import { WithdrawsController } from './withdraws.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { WithdrawT } from './entities/withdraw.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([WithdrawT]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [WithdrawsController],
  providers: [WithdrawsService],
})
export class WithdrawsModule { }

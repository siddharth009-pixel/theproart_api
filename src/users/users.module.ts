import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { ProfilesController, UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserT } from 'src/users/entities/user.entity';
import { ScheduleModule } from '@nestjs/schedule';
@Module({
  imports: [TypeOrmModule.forFeature([UserT]),
  ScheduleModule.forRoot()],
  controllers: [UsersController, ProfilesController],
  providers: [UsersService],
})
export class UsersModule {  }

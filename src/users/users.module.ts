import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { ProfilesController, UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserT } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserT])],
  controllers: [UsersController, ProfilesController],
  providers: [UsersService],
})
export class UsersModule {}

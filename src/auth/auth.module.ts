import { CacheModule, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import {  AppController, AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserT } from 'src/users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { GoogleStrategy } from './google.strategy';
import { AppService } from './app.service';
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: 2592000000,
      },
    }),
    CacheModule.register(),
    TypeOrmModule.forFeature([UserT]),
  ],
  controllers: [AuthController,AppController],
  providers: [AuthService, JwtStrategy, AppService],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}

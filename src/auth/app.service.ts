import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserT } from '../users/entities/user.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(UserT) private userRepository: Repository<UserT>,
    private jwtService: JwtService,
  ) {}
  async googleLogin(req) {
    if (!req.user) {
      return 'No user from google';
    }
    const { id } = req.user.payload;
    const user = await this.userRepository.findOne(id);
    if (user) {
      const { id, permission } = user;
      const payload = { id };
      const asscesstoken = this.jwtService.sign({ payload });
      return {
        token: asscesstoken,
        permissions: [permission],
        // permissions: ['super_admin', 'customer'],
      };
    } else {
      return 'No user from google';
    }
  }
}

import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  AuthResponse,
  ChangePasswordDto,
  ForgetPasswordDto,
  LoginDto,
  CoreResponse,
  RegisterDto,
  ResetPasswordDto,
  VerifyForgetPasswordDto,
  SocialLoginDto,
  OtpLoginDto,
  OtpResponse,
  VerifyOtpDto,
  OtpDto,
  Permission,
} from './dto/create-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { plainToClass } from 'class-transformer';
import { User, UserT } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { decrypt, encrypt } from 'src/common/cryproencdes';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserT) private userRepository: Repository<UserT>,
    private jwtService: JwtService,
  ) {}
  async register(createUserInput: RegisterDto): Promise<AuthResponse> {
    if (!createUserInput.permission) {
      createUserInput.permission = Permission.CUSTOMER;
    }
    createUserInput.password = encrypt(createUserInput.password);
    const newPost = this.userRepository.create({
      ...createUserInput,
    });
    try {
      const user = await this.userRepository.save(newPost);
      const { id } = user;
      const payload = { id };
      const asscesstoken = this.jwtService.sign({ payload });
      return {
        token: asscesstoken,
        permissions: ['super_admin', 'customer'],
      };
    } catch (error) {
      return error;
    }
  }
  async login(loginInput: LoginDto): Promise<AuthResponse | string> {
    const user = await this.userRepository.findOne({
      email: loginInput.email,
    });
    if (user) {
      if (decrypt(user.password) == loginInput.password) {
        const { id } = user;
        const payload = { id };
        const asscesstoken = this.jwtService.sign({ payload });
        return {
          token: asscesstoken,
          permissions: ['super_admin', 'customer'],
        };
      } else {
        throw new UnauthorizedException('Enter Valid Password.');
      }
    } else {
      throw new NotFoundException('User Not found');
    }
  }
  async changePassword(
    changePasswordInput: ChangePasswordDto,
    id: number,
  ): Promise<CoreResponse> {
    if (changePasswordInput.newPassword == changePasswordInput.oldPassword) {
      throw new BadRequestException('Please Enter Diffrent Password');
    }
    if (id) {
      const user = await this.userRepository.findOne({ id });
      if (user) {
        if (decrypt(user.password) == changePasswordInput.oldPassword) {
          const passwordnew = encrypt(changePasswordInput.newPassword);
          user.password = passwordnew;
          await this.userRepository.save(user);
          return {
            success: true,
            message: 'Password change successful',
          };
        } else {
          throw new UnauthorizedException('Enter Valid Old Password.');
        }
      } else {
        throw new NotFoundException('User Not found');
      }
    }
  }

  async forgetPassword(
    forgetPasswordInput: ForgetPasswordDto,
  ): Promise<CoreResponse> {
    const user = await this.userRepository.findOne({
      email: forgetPasswordInput.email,
    });
    if (user) {
      return {
        success: true,
        message: 'Password Change Successfully.',
      };
    } else {
      return {
        success: false,
        message: 'User not found',
      };
    }
  }
  async verifyForgetPasswordToken(
    verifyForgetPasswordTokenInput: VerifyForgetPasswordDto,
  ): Promise<CoreResponse> {
    return {
      success: true,
      message: 'Password change successful',
    };
  }
  async resetPassword(
    resetPasswordInput: ResetPasswordDto,
  ): Promise<CoreResponse> {
    return {
      success: true,
      message: 'Password change successful',
    };
  }
  async socialLogin(socialLoginDto: SocialLoginDto): Promise<AuthResponse> {
    return {
      token: 'jwt token',
      permissions: ['super_admin', 'customer'],
    };
  }
  async otpLogin(otpLoginDto: OtpLoginDto): Promise<AuthResponse> {
    return {
      token: 'jwt token',
      permissions: ['super_admin', 'customer'],
    };
  }
  async verifyOtpCode(verifyOtpInput: VerifyOtpDto): Promise<CoreResponse> {
    return {
      message: 'success',
      success: true,
    };
  }
  async sendOtpCode(otpInput: OtpDto): Promise<OtpResponse> {
    return {
      message: 'success',
      success: true,
      id: '1',
      provider: 'google',
      phone_number: '+919494949494',
      is_contact_exist: true,
    };
  }

  // async getUsers({ text, first, page }: GetUsersArgs): Promise<UserPaginator> {
  //   const startIndex = (page - 1) * first;
  //   const endIndex = page * first;
  //   let data: User[] = this.users;
  //   if (text?.replace(/%/g, '')) {
  //     data = fuse.search(text)?.map(({ item }) => item);
  //   }
  //   const results = data.slice(startIndex, endIndex);
  //   return {
  //     data: results,
  //     paginatorInfo: paginate(data.length, page, first, results.length),
  //   };
  // }
  // public getUser(getUserArgs: GetUserArgs): User {
  //   return this.users.find((user) => user.id === getUserArgs.id);
  // }
  async me(id: number): Promise<UserT> {
    const user = await this.userRepository.findOne({ id });
    return user;
  }

  // updateUser(id: number, updateUserInput: UpdateUserInput) {
  //   return `This action updates a #${id} user`;
  // }
}

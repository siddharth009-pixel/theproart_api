import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { EmailDto } from './dto/email.dto';
import { Cache } from 'cache-manager';
import { MailTrigger } from './mail-service/mail-trigger';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
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
  EmailOtpDto,
  AdminRequest,
} from './dto/create-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { plainToClass } from 'class-transformer';
import { User, UserT } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { decrypt, encrypt } from 'src/common/cryproencdes';
const { msg91OTP } = require('msg91-lib');
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserT) private userRepository: Repository<UserT>,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  msg91otp = new msg91OTP({
    authKey: process.env.SENDOTP_AUTHKEY,
    templateId: process.env.SENDOTP_TEMPLATE_ID,
  });

  async register(createUserInput: RegisterDto): Promise<AuthResponse> {
    if (!createUserInput.permission) {
      createUserInput.permission = Permission.CUSTOMER;
    }
    createUserInput.password = encrypt(createUserInput.password);
    const newPost = this.userRepository.create({
      ...createUserInput,
    });
    try {
      const existingUser = await this.userRepository.findOne({
        email: createUserInput.email,
      });
      if (existingUser) {
        throw new UnauthorizedException('User already exists');
      }
      const user = await this.userRepository.save(newPost);
      const { id, permission } = user;
      const payload = { id };
      const asscesstoken = this.jwtService.sign({ payload });
      return {
        token: asscesstoken,
        permissions: [permission],
        // permissions: ['store_owner', 'customer'],
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
        const { id, permission } = user;
        const payload = { id };
        const asscesstoken = this.jwtService.sign({ payload });
        return {
          token: asscesstoken,
          permissions: [permission],
          // permissions: ['super_admin', 'customer'],
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

  async forgetPassword(forgetPasswordInput: ForgetPasswordDto) {
    const user = await this.userRepository.findOne({
      email: forgetPasswordInput.email,
    });
    if (user) {
      await this.changePasswordGenerateOTP(forgetPasswordInput); //send email
      return {
        success: true,
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
  ) {
    const user = await this.userRepository.findOne({
      email: verifyForgetPasswordTokenInput.email,
    });
    return this.changePasswordCompareOTP(verifyForgetPasswordTokenInput, user);
  }
  async resetPassword(
    resetPasswordInput: ResetPasswordDto,
  ): Promise<CoreResponse> {
    const user = await this.userRepository.findOne({
      email: resetPasswordInput.email,
    });
    if (user) {
      const passwordnew = encrypt(resetPasswordInput.password);
      user.password = passwordnew;
      await this.userRepository.save(user);
      return {
        success: true,
        message: 'Password change successful',
      };
    } else {
      throw new NotFoundException('User Not found');
    }
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

  async sendOtpCode(otpInput: OtpDto) {
    console.log('calling');
    if (otpInput?.phone_number) {
      try {
        const response = await this.msg91otp.send(otpInput?.phone_number);
        console.log('response', response);
        return response;
      } catch (error) {
        console.log('error', error);
        return error;
      }
    } else {
      return {
        statusCode: 400,
        message: 'mobile number did not passed',
      };
    }
  }

  async verifyOtpCode(verifyOtpInput: VerifyOtpDto): Promise<any> {
    if (verifyOtpInput?.phone_number && verifyOtpInput?.code) {
      let args = {
        otp: +verifyOtpInput?.code,
      };
      console.log('args', args);
      try {
        const response = await this.msg91otp.verify(
          verifyOtpInput?.phone_number,
          args?.otp,
        );
        console.log('response', response);
        return response;
      } catch (error) {
        console.log('error', error);
        return error;
      }
    } else {
      return {
        statusCode: 400,
        message: 'Enter OTP correctly',
      };
    }
  }
  async adminApprove(adminRequestDTO: AdminRequest) {
    if (adminRequestDTO?.email) {
      const user = await this.userRepository.findOne({
        email: adminRequestDTO?.email,
      });
      if (user) {
        user.permission = Permission.SUPER_ADMIN;
        return await this.userRepository.save(user);
      } else {
        throw new NotFoundException('User Not found');
      }
    }
    return false;
  }

  async me(id: number): Promise<UserT> {
    const user = await this.userRepository.findOne({ id });
    return user;
  }

  private async getCache(id: string): Promise<any> {
    return this.cacheManager.get(id);
  }

  private async setCache(id: string, value: any): Promise<void> {
    await this.cacheManager.set(id, value, { ttl: 300 });
  }

  private generateOTP(): number {
    return Math.floor(Math.random() * 1000000);
  }
  async changePasswordGenerateOTP(forgetPasswordInput: ForgetPasswordDto) {
    const { email } = forgetPasswordInput;
    const user = await this.userRepository.findOne({
      email: email,
    });
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    const otp: number = this.generateOTP();
    const mailTrigger = new MailTrigger({
      name: user.name,
      email: user.email,
      otp: otp,
    });
    const info: SMTPTransport.SentMessageInfo = await mailTrigger.sendMail();
    await this.setCache(user.email, otp);
    return this.changePasswordToken(email);
  }

  changePasswordToken(email: string) {
    const payload = {
      sub: email,
    };
    return { email: email, token: this.jwtService.sign({ payload }) };
  }

  async changePasswordCompareOTP(otpDto: VerifyForgetPasswordDto, user) {
    const { token } = otpDto;
    const cacheValue: any = await this.getCache(user.email);
    if (!cacheValue) {
      return {
        success: false,
        message: 'OTP Expired',
      };
    } else if (+cacheValue !== +token) {
      return {
        success: false,
        message: "OTP doesn't match.",
      };
    } else {
      return {
        success: true,
      };
    }
  }
}

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
import SendOtp from 'sendotp';
const sendOtp = new SendOtp(`${process.env.SENDOTP_AUTHKEY}`)

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserT) private userRepository: Repository<UserT>,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) { }
  
  async register(createUserInput: RegisterDto): Promise<AuthResponse> {
    if (!createUserInput.permission) {
      createUserInput.permission = Permission.CUSTOMER;
    }
    createUserInput.password = encrypt(createUserInput.password);
    const newPost = this.userRepository.create({
      ...createUserInput,
    });
    try {
      const existingUser=await this.userRepository.findOne({email: createUserInput.email})
      if(existingUser) {
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
    console.log('LoginDto', LoginDto);
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
  async verifyOtpCode(verifyOtpInput: VerifyOtpDto): Promise<any> {
    const data: any = await this.verifyotp(verifyOtpInput)
      .then((data) => {
        return data;
      }).catch((err) => {
        return err;
      })
    return data;
  }

  async adminApprove(adminRequestDTO: AdminRequest) {
    if (adminRequestDTO?.email) {
      const user = await this.userRepository.findOne({ email: adminRequestDTO?.email })
      if (user) {
        user.permission = Permission.SUPER_ADMIN;
        return await this.userRepository.save(user);
      } else {
        throw new NotFoundException('User Not found');
      }
    }
    return false
  }

  // async sendOtpCode(otpInput: OtpDto): Promise<OtpResponse> {
  async sendOtpCode(otpInput: OtpDto) {

    const data = await this.sendotp(otpInput)
      .then((data) => {
        return data;
      }).catch((err) => {
        return err;
      })
    return data;
  }


  async sendotp(otpInput) {
    return new Promise((resolve, reject) => {
      (async () => {
        await sendOtp.send(otpInput?.phone_number, "hell1", async function (error, data) {
          if (error) {
            return reject(
              {
                message: error?.message ? error?.message : 'failed to send otp',
                success: false,
                id: error?.message,
                provider: 'google',
                phone_number: otpInput?.phone_number,
                is_contact_exist: true,
              }
            );
          } else {
            return resolve({
              message: 'success',
              success: true,
              id: data?.message,
              provider: 'google',
              phone_number: otpInput?.phone_number,
              is_contact_exist: true,
            })
          }
        });
      })();
    });
  }

  async verifyotp(otpInput) {
    return new Promise((resolve, reject) => {
      (async () => {
        await sendOtp.verify(otpInput?.phone_number, otpInput?.code, function (error, data) {
          if (error) return reject(error);
          if (data) {
            if (data.type == 'success') {
              return resolve({
                message: 'success',
                success: true
              })
            }
            if (data.type == 'error') {
              return reject(
                {
                  message: 'Incorrect otp',
                  success: false,
                }
              );
            }
          }
          else {
            return reject(
              {
                message: 'Incorrect otp',
                success: false,
              }
            );
          }
        });
      })();
    });
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
    // console.log('user object is :',user)
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
    console.log(mailTrigger);
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
    console.log(cacheValue);
    console.log(token);
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

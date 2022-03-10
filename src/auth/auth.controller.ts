import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Injectable,
  NestInterceptor,
  ExecutionContext,
  UseInterceptors,
  Redirect,
  HttpCode,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import {
  AdminRequest,
  ChangePasswordDto,
  ForgetPasswordDto,
  LoginDto,
  OtpDto,
  OtpLoginDto,
  RegisterDto,
  ResetPasswordDto,
  SocialLoginDto,
  VerifyForgetPasswordDto,
  VerifyOtpDto,
} from './dto/create-auth.dto';
import { AppService } from './app.service';
import { Observable } from 'rxjs';

@Controller()
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  // constructor(private readonly authService: AuthService,private readonly appService: AppService) {}
  // @Get('google')
  // @UseGuards(AuthGuard('google'))
  // async googleAuth(@Req() req) {}

  // @Get('google/redirect')
  // @UseGuards(AuthGuard('google'))
  // googleAuthRedirect(@Req() req) {
  //   return this.appService.googleLogin(req)
  // }
  @Post('register')
  createAccount(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('token')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('admin-request')
  async adminRequest(@Body() adminRequestDTO: AdminRequest) {
    return this.authService.adminApprove(adminRequestDTO);
  }
  @Post('social-login-token')
  socialLogin(@Body() socialLoginDto: SocialLoginDto) {
    return this.authService.socialLogin(socialLoginDto);
  }
  @Post('otp-login')
  otpLogin(@Body() otpLoginDto: OtpLoginDto) {
    return this.authService.otpLogin(otpLoginDto);
  }
  @Post('send-otp-code')
  sendOtpCode(@Body() otpDto: OtpDto) {
    return this.authService.sendOtpCode(otpDto);
  }
  @Post('verify-otp-code')
  verifyOtpCode(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verifyOtpCode(verifyOtpDto);
  }
  @Post('forget-password')
  forgetPassword(@Body() forgetPasswordDto: ForgetPasswordDto) {
    return this.authService.forgetPassword(forgetPasswordDto);
  }
  @Post('reset-password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
  @Post('change-password')
  @UseGuards(AuthGuard())
  changePassword(@Body() changePasswordDto: ChangePasswordDto, @Req() req) {
    return this.authService.changePassword(
      changePasswordDto,
      req?.user?.payload?.id,
    );
  }
  @Post('logout')
  async logout(): Promise<boolean> {
    return true;
  }

  @Post('verify-forget-password-token')
  verifyForgetPassword(
    @Body() verifyForgetPasswordDto: VerifyForgetPasswordDto,
  ) {
    return this.authService.verifyForgetPasswordToken(verifyForgetPasswordDto);
  }

  @Get('me')
  @UseGuards(AuthGuard())
  me(@Req() req) {
    const id = req?.user?.payload?.id || 1;
    return this.authService.me(id);
  }
}
@Injectable()
export class RedirectInterceptor implements NestInterceptor {
  constructor(private readonly target: string) {}
  intercept(context: ExecutionContext, stream$: any): Observable<any> {
    const response = context.switchToHttp().getResponse();
    response.redirect(this.target);
    return stream$;
  }
}

@Controller('google')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('login')
  @UseGuards(AuthGuard('google'))
  async googleLogin(@Req() req) {
    if (req.user) {
      console.log('req.user', req.user);
    } else {
      console.log('there is no req.user');
    }
    return 'donee !!!';
  }
  
  // @Redirect('http://localhost:3003/login/success',401)
  @Get('redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req,@Res() res) {
    console.log('req.user', req.user);
  
    res.status(401).redirect('http://localhost:3003/login/success');
    // return this.appService.googleLogin(req);
  }

  @Get('me')
  @UseGuards(AuthGuard('google'))
  @UseInterceptors(new RedirectInterceptor('http://localhost:3003/google'))
  @Redirect('http://localhost:3000/login/google')
  me(@Req() req) {
    const id = req?.user?.payload?.id || 1;
    return id ?? 1;
  }

  // @Get('me')
  // @UseGuards(AuthGuard())
  // me(@Req() req) {
  //   // console.log('user is :',req?.user)
  //   const id = req?.user?.payload?.id||1;
  //   return this.authService.me(id);
  // }
}

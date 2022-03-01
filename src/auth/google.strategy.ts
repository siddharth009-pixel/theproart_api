import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { config } from 'dotenv';

import { Injectable } from '@nestjs/common';

config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {

  constructor() {
    super({
      clientID: "983931117667-s67iv79idn5bs65c56omiof3p0m54se3.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: 'http://localhost:5000/api/google/redirect',
      scope: ['email', 'profile'],
    });
  }

  async validate (accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const { name, emails, photos } = profile
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken
    }

    let payload;
    const isUser = await this.userRepository.findOne({email: emails[0]});
    if(isUser){
        payload={
            id: isUser.id
        }
    }else{
        
    }
    return payload
    // const { id } = payload;
    // const user = await this.userRepository.findOne(id);
    // if (!user) {
    //   throw new UnauthorizedException();
    // }
    // return payload;
    // done(null, user);
  }
}
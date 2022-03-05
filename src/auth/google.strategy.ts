import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { config } from 'dotenv';

import { Injectable, NotFoundException } from '@nestjs/common';
import { UserT, UserType } from '../users/entities/user.entity';
import { Permission } from './dto/create-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as passport from 'passport';
config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @InjectRepository(UserT) private userRepository: Repository<UserT>,
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:5000/api/google/redirect',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    // const { name, emails, photos } = profile;
    // const user = {
    //   email: emails[0].value,
    //   firstName: name.givenName,
    //   lastName: name.familyName,
    //   picture: photos[0].value,
    //   accessToken,
    // };
    // console.log('profile', profile);
    const { name, emails, photos } = profile;
    let payload;
    // console.log('emails[0]', emails[0]);
    const isUser = await this.userRepository.findOne({
      email: emails[0].value,
    });
    if (isUser) {
      // console.log('isUser', isUser);
      if (isUser.userType == UserType.GOOGLE) {
        payload = {
          id: isUser.id,
        };
      } else {
        // done('please login with TheProArt login',null)
        throw new NotFoundException('please login with TheProArt login');
      }
    } else {
      // console.log('notUser');
      let newUser = new UserT();
      newUser.name = name.givenName;
      newUser.email = emails[0].value;
      newUser.permission = Permission.CUSTOMER;
      newUser.userType = UserType.GOOGLE;
      newUser.googleId = profile.id;
      const user = await this.userRepository.save(newUser);
      payload = {
        id: user.id,
      };
    }
    // return payload;
    let finalUserId = payload.id;
    return {payload}
    done(null, finalUserId);
  }
  // passport.use(this)
}

// import { PassportStrategy } from '@nestjs/passport';
// import { Strategy, VerifyCallback } from 'passport-google-oauth20';
// import { config } from 'dotenv';

// import { Injectable, NotFoundException } from '@nestjs/common';
// import { UserT, UserType } from '../users/entities/user.entity';
// import { Permission } from './dto/create-auth.dto';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';

// import * as passport from 'passport';
// config();

// @Injectable()
// export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
//   constructor(
//     @InjectRepository(UserT) private userRepository: Repository<UserT>,
//   ) {
//     super({
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: 'http://localhost:5000/api/google/redirect',
//       scope: ['email', 'profile'],
//     });
//   }

//   async validate(
//     accessToken: string,
//     refreshToken: string,
//     profile: any,
//     done: VerifyCallback,
//   ): Promise<any> {
//     // const { name, emails, photos } = profile;
//     // const user = {
//     //   email: emails[0].value,
//     //   firstName: name.givenName,
//     //   lastName: name.familyName,
//     //   picture: photos[0].value,
//     //   accessToken,
//     // };
//     console.log('profile', profile);
//     const { name, emails, photos } = profile;
//     let payload;
//     console.log('emails[0]',emails[0])
//     const isUser = await this.userRepository.findOne({ email: emails[0].value})
//     if (isUser) {
//       console.log('isUser',isUser)
//       if (isUser.userType == UserType.GOOGLE) {
//         payload = {
//           id: isUser.id,
//         };
//       } else {
//         // done('please login with TheProArt login',null)
//         throw new NotFoundException('please login with TheProArt login');
//       }
//     } else {
//       console.log('notUser')
//       let newUser = new UserT();
//       newUser.name = name.givenName;
//       newUser.email = emails[0].value;
//       newUser.permission = Permission.CUSTOMER;
//       newUser.userType = UserType.GOOGLE;
//       newUser.googleId = profile.id;
//       const user = await this.userRepository.save(newUser);
//       payload = {
//         id: user.id,
//       };
//     }
//     // return payload;
//     let finalUserId = payload.id;
//     return done(null,finalUserId);

//   }
//   // passport.use(this)
// }

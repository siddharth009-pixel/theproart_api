import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUsersDto, UserPaginatorU } from './dto/get-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import Fuse from 'fuse.js';

import { User, UserT } from './entities/user.entity';
import { paginate } from 'src/common/pagination/paginate';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';
import { AddressT, UserAddressT } from 'src/addresses/entities/address.entity';
import { ProfileT, SocialT } from './entities/profile.entity';
import {
  AttachmentT,
  ProfileAttachment,
} from 'src/common/entities/attachment.entity';
import { throwIfEmpty } from 'rxjs';

const options = {
  keys: ['name', 'type.slug', 'categories.slug', 'status'],
  threshold: 0.3,
};
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserT) private userRepository: Repository<UserT>,
  ) {}
  userAddressRepositry = getRepository(UserAddressT);
  addessRepositry = getRepository(AddressT);
  profileRepositry = getRepository(ProfileT);
  attachmenttRepositry = getRepository(ProfileAttachment);

  create(createUserDto: CreateUserDto) {
    const user = new UserT();
    user.name = createUserDto.name;
    user.email = createUserDto.email;
    user.permission = createUserDto.permission;
    user.password = createUserDto.password;
    if (createUserDto.address) {
      createUserDto.address.map(async (address) => {
        const addresslocal = new AddressT();

        const user_address = new UserAddressT();
        user_address.city = address.address.city;
        user_address.street_address = address.address.street_address;
        user_address.country = address.address.country;
        user_address.zip = address.address.zip;
        user_address.state = address.address.state;

        addresslocal.customer = user;
        addresslocal.title = address.title;
        addresslocal.type = address.type;
        addresslocal.default = address.default;
        addresslocal.address = user_address;
        this.addessRepositry.save(addresslocal);
      });
    }
    const profile = new ProfileT();

    if (createUserDto.profile) {
      const avatar = new AttachmentT();
      const profileBody = createUserDto.profile;
      avatar.original = profileBody.avatar.original;
      avatar.thumbnail = profileBody.avatar.thumbnail;
      this.attachmenttRepositry.save(avatar);

      profile.bio = profileBody.bio;
      profile.contact = profileBody.contact;

      profileBody.socials.map((social) => {
        const socialNew = new SocialT();
        socialNew.type = social.type;
        socialNew.link = social.link;
        profile.socials = [socialNew];
      });
      this.profileRepositry.save(profile);
    }
    return this.userRepository.save(user);
  }

  async getUsers({ text, limit, page }: GetUsersDto): Promise<UserPaginatorU> {
    if (!page) page = 1;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    let data: UserT[] = await this.userRepository.find();
    if (text?.replace(/%/g, '')) {
      const fuse = new Fuse(data, options);
      data = fuse.search(text)?.map(({ item }) => item);
    }
    const results = data.slice(startIndex, endIndex);
    const url = `/users?limit=${limit}`;

    return {
      data: results,
      ...paginate(data.length, page, limit, results.length, url),
    };
  }
  findOne(id: number) {
    return this.userRepository.findOne(id);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne(id);
    user.name = updateUserDto?.name;
    if (user['profile'] == undefined || user['profile'] == null) {
      let avatar, profilen;
      if (Object.keys(updateUserDto?.profile?.avatar).length == 0) {
        delete updateUserDto.profile.avatar;
        profilen = await this.profileRepositry.save({
          ...updateUserDto.profile,
        });
      } else {
        delete updateUserDto?.profile?.avatar?.id;
        avatar = await this.attachmenttRepositry.save({
          ...updateUserDto.profile.avatar,
          created_at: new Date().toString(),
        });
        profilen = await this.profileRepositry.save({
          ...updateUserDto.profile,
          avatar: avatar,
        });
      }
      user.profile = profilen;
      this.userRepository.save(user);
    } else {
      let avatar;
      const profile = await this.profileRepositry.findOne({
        id: user.profile.id,
      });
      profile.bio = updateUserDto?.profile?.bio;
      profile.contact = updateUserDto?.profile?.contact;
      if (profile['avatar'] == undefined || profile['avatar'] == null) {
        if (updateUserDto?.profile?.avatar?.original) {
          avatar = await this.attachmenttRepositry.save({
            ...updateUserDto.profile.avatar,
            created_at: new Date().toString(),
          });
          profile.avatar = avatar;
        }
      } else {
        if (updateUserDto?.profile?.avatar?.original) {
          profile.avatar.original = updateUserDto?.profile?.avatar?.original;
          profile.avatar.thumbnail = updateUserDto?.profile?.avatar?.thumbnail;
        }
      }
      this.profileRepositry.save(profile);
    }
    if (updateUserDto?.address) {
      updateUserDto.address.map(async (address) => {
        if (address['id']) {
          const address_id = address['id'];
          const useraddressid = address.address['id'];
          await this.userAddressRepositry.update(
            { id: useraddressid },
            {
              ...address.address,
            },
          );
          delete address.address;
          delete address.customer_id;
          await this.addessRepositry.update(
            { id: address_id },
            {
              ...address,
            },
          );
        } else {
          const addresslocal = new AddressT();
          const user_address = await this.userAddressRepositry.save({
            ...address.address,
          });
          addresslocal.customer = user;
          addresslocal.address = user_address;
          addresslocal.title = address.title;
          addresslocal.type = address.type;
          addresslocal.default = address?.default;
          await this.addessRepositry.save(addresslocal);
        }
      });
    }
    return user;
  }
  async remove(id: number) {
    return `This action removes a #${id} user`;
  }
}

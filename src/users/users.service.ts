import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUsersDto, UserPaginator } from './dto/get-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import Fuse from 'fuse.js';

import { User, UserT } from './entities/user.entity';
import usersJson from './users.json';
import { paginate } from 'src/common/pagination/paginate';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository, Connection, getConnection } from 'typeorm';
import { AddressT, UserAddressT } from 'src/addresses/entities/address.entity';
import { ProfileT, SocialT } from './entities/profile.entity';
import { AttachmentT } from 'src/common/entities/attachment.entity';
const users = plainToClass(User, usersJson);

const options = {
  keys: ['name', 'type.slug', 'categories.slug', 'status'],
  threshold: 0.3,
};
const fuse = new Fuse(users, options);
@Injectable()
export class UsersService {
  private users: User[] = users;
  constructor(
    @InjectRepository(UserT) private userRepository: Repository<UserT>,
  ) {}
  userAddressRepositry = getRepository(UserAddressT);
  addessRepositry = getRepository(AddressT);
  profileRepositry = getRepository(ProfileT);
  attachmenttRepositry = getRepository(AttachmentT);

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

      profile.avatar = avatar;
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

  async getUsers({ text, limit, page }: GetUsersDto): Promise<UserPaginator> {
    if (!page) page = 1;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    let data: User[] = this.users;
    if (text?.replace(/%/g, '')) {
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
    return this.users.find((user) => user.id === id);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne(id);
    const profile = await this.profileRepositry.findOne({ customer: user });
    if (!profile) {
      getRepository(ProfileT)
        .createQueryBuilder()
        .insert()
        .into(ProfileT)
        .values({
          customer: user,
          ...updateUserDto.profile,
        })
        .execute();
      return `Profile Updated Successfully`;
    } else {
      getRepository(ProfileT)
        .createQueryBuilder()
        .update(ProfileT)
        .set({
          ...updateUserDto.profile,
        })
        .where('customerId = :customerId', { customerId: id })
        .execute();
      return `Profile Updated Successfully`;
    }
  }
  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}

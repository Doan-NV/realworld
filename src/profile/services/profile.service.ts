import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { getRepository } from 'typeorm';
import { ProfileEntity } from '../entities/follower.entity';
@Injectable()
export class ProfileService {
  constructor() {}

  // get profile
  async findProfile(username: string, id: number): Promise<any> {
    if (!username) {
      throw new HttpException(
        { message: 'user doesnot exist!!' },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    let { userId, user } = await this.getUser(username);
    const [follows] = await getRepository(ProfileEntity)
      .createQueryBuilder()
      .where('followerId = :id', { id: id })
      .andWhere('followingId  = :userId', { userId: userId })
      .execute();

    let profile = {
      name: user.username,
      bio: user.bio,
      image: user.image,
      following: follows ? true : false,
    };
    return { profile };
  }

  // following
  async follow(username: string, id: number): Promise<any> {
    if (!username) {
      throw new HttpException(
        { message: 'user doesnot exist!!' },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    let { userId, user } = await this.getUser(username);
    await getRepository(ProfileEntity)
      .createQueryBuilder()
      .insert()
      .into(ProfileEntity)
      .values([{ followerId: id, followingId: userId }])
      .execute();
    let profile = {
      name: user.username,
      bio: user.bio,
      image: user.image,
      following: true,
    };
    return { profile };
  }

  // get user
  async getUser(username: string): Promise<any> {
    const user = await getRepository(User)
      .createQueryBuilder()
      .where('username = :username', { username })
      .getOne();
    if (!user) {
      throw new HttpException(
        { message: 'user doesnot exist!!' },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    let userId = user.id;
    return { userId, user };
  }
}

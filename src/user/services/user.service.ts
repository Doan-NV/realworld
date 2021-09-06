import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from '../dto/update-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  findAll(): Promise<any> {
    return this.userRepository.find();
  }

  //login
  async login(loginUserDto): Promise<any> {
    const { email, password } = loginUserDto.user;
    const user = await getRepository(User)
      .createQueryBuilder()
      .where('email = :email', { email })
      .getOne();

    if (!user) {
      throw new HttpException(
        { message: 'wrong email ' },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    } else {
      let isUser = await bcrypt.compare(password, user.password);
      if (!isUser) {
        throw new HttpException(
          { message: 'wrong passwrod' },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      } else {
        return this.buildUser(user);
      }
    }
  }
  // findOne
  async findOne(username: string): Promise<any> {
    const user = await getRepository(User)
      .createQueryBuilder('user')
      .where('username = :username', { username: username })
      .getOne();

    return this.buildUser(user);
  }
  // findOne(id: string)

  // create
  async create(createUserDto): Promise<any> {
    const { email, username, password } = createUserDto.user;

    // check exist
    const userExist = await getRepository(User)
      .createQueryBuilder('user')
      .where('user.username = :username', { username })
      .orWhere('user.email = :email', { email })
      .getOne();

    if (userExist) {
      throw new HttpException(
        { errors: 'Unexpected error' },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    // create new user
    const newUser = new User();
    newUser.email = email;
    newUser.username = username;
    newUser.password = password;
    newUser.article = [];

    const saveUser = await this.userRepository.save(newUser);
    return this.buildUser(saveUser);
  }

  buildUser(userx) {
    const user = {
      id: userx.id,
      username: userx.username,
      email: userx.email,
      bio: userx.bio,
      token: this.generateToken(userx),
      image: userx.image,
    };
    return { user };
  }

  // create jwt
  generateToken(user: any) {
    const generateUser = {
      id: user.id,
      username: user.username,
      email: user.email,
    };
    const token = this.jwtService.sign(generateUser);
    return token;
  }

  async update(id: number, updateUserDto: any): Promise<any> {
    const user = await this.userRepository.findOne(id);
    delete user.password;
    delete user.favorites;
    let update = Object.assign(user, updateUserDto);
    return this.buildUser(user);
  }
}

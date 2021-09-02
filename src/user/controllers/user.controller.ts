import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ValidationPipe } from 'src/common/validation/validation.pipe';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserService } from '../services/user.service';
import { GetUserId } from 'src/common/getUserId';
@Controller('api')
export class UserController {
  constructor(private userService: UserService, private getUserId: GetUserId) {}

  @Get('users')
  async finAll(): Promise<any> {
    return this.userService.findAll();
  }

  // Get current user
  @UseGuards(JwtAuthGuard)
  @Get('user')
  async getDetail(@Request() req): Promise<any> {
    console.log(req.user.id);
    return this.userService.findOne(req.user.username);
  }

  // register new user
  @UsePipes(new ValidationPipe())
  @Post('users')
  async create(@Body() bodys: CreateUserDto): Promise<any> {
    return this.userService.create(bodys);
  }

  @Post('users/login')
  async login(@Body() bodys: LoginUserDto): Promise<any> {
    return this.userService.login(bodys);
  }

  @UseGuards(JwtAuthGuard)
  // @UsePipes(new ValidationPipe())
  @Put('user')
  async update(@Body() bodys: UpdateUserDto, @Request() req): Promise<any> {
    let id = req.user.id;
    return this.userService.update(id, bodys);
  }
}

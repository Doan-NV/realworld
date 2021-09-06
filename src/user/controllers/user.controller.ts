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
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ValidationPipe } from 'src/common/validation/validation.pipe';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserService } from '../services/user.service';
@Controller('api')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({ summary: 'All User' })
  @ApiResponse({
    status: 200,
    description: 'OK',
  })
  @ApiResponse({
    status: 422,
    description: 'Unexpected error',
  })
  @Get('users')
  async finAll(): Promise<any> {
    return this.userService.findAll();
  }

  // Get current user
  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({
    status: 200,
    description: 'OK',
  })
  @ApiResponse({
    status: 422,
    description: 'Unexpected error',
  })
  @UseGuards(JwtAuthGuard)
  @Get('user')
  async getDetail(@Request() req): Promise<any> {
    return this.userService.findOne(req.user.username);
  }

  // register new user
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'OK',
  })
  @ApiResponse({
    status: 422,
    description: 'Unexpected error',
  })
  @UsePipes(new ValidationPipe())
  @Post('users')
  async create(@Body() user: CreateUserDto): Promise<any> {
    return this.userService.create(user);
  }

  @ApiOperation({ summary: 'Existing user login' })
  @ApiResponse({
    status: 201,
    description: 'OK',
  })
  @ApiResponse({
    status: 422,
    description: 'Unexpected error',
  })
  @Post('users/login')
  async login(@Body() user: LoginUserDto): Promise<any> {
    return this.userService.login(user);
  }

  @ApiOperation({ summary: 'Update current user' })
  @ApiResponse({
    status: 201,
    description: 'OK',
  })
  @ApiResponse({
    status: 422,
    description: 'Unexpected error',
  })
  @UseGuards(JwtAuthGuard)
  // @UsePipes(new ValidationPipe())
  @Put('user')
  async update(@Body() bodys: UpdateUserDto, @Request() req): Promise<any> {
    let id = req.user.id;
    return this.userService.update(id, bodys);
  }
}

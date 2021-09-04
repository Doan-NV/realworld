import {
  Controller,
  Get,
  Param,
  UseGuards,
  Request,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/user/auth/jwt-auth.guard';
import { ProfileService } from '../services/profile.service';

@Controller('api')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @ApiOperation({ summary: 'Get a profile' })
  @ApiResponse({
    status: 201,
    description: 'OK',
  })
  @ApiResponse({
    status: 422,
    description: 'Unexpected error',
  })
  @UseGuards(JwtAuthGuard)
  @Get('profiles/:username')
  async get(@Param() params, @Request() req): Promise<any> {
    return this.profileService.findProfile(params.username, req.user.id);
  }

  @ApiOperation({ summary: 'Follow a user' })
  @ApiResponse({
    status: 201,
    description: 'OK',
  })
  @ApiResponse({
    status: 422,
    description: 'Unexpected error',
  })
  @UseGuards(JwtAuthGuard)
  @Post('profiles/:username/follow')
  async follow(@Param() params, @Request() req): Promise<any> {
    return this.profileService.follow(params.username, req.user.id);
  }
}

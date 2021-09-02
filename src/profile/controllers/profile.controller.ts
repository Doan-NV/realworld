import {
  Controller,
  Get,
  Param,
  UseGuards,
  Request,
  Post,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/user/auth/jwt-auth.guard';
import { ProfileService } from '../services/profile.service';

@Controller('api')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profiles/:username')
  async get(@Param() params, @Request() req): Promise<any> {
    return this.profileService.findProfile(params.username, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('profiles/:username/follow')
  async follow(@Param() params, @Request() req): Promise<any> {
    return this.profileService.follow(params.username, req.user.id);
  }
}

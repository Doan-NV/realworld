import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TagsService } from '../services/tags.service';

@Controller('api')
export class TagsController {
  constructor(private tagService: TagsService) {}

  @ApiOperation({ summary: 'Get tags' })
  @ApiResponse({
    status: 200,
    description: 'OK',
  })
  @ApiResponse({
    status: 422,
    description: 'Unexpected error',
  })
  @Get('tags')
  async getTags(): Promise<any> {
    return this.tagService.getTags();
  }
}

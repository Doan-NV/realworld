import { Controller, Get } from '@nestjs/common';
import { TagsService } from '../services/tags.service';

@Controller('api')
export class TagsController {
  constructor(private tagService: TagsService) {}

  @Get('tags')
  async getTags(): Promise<any> {
    return this.tagService.getTags();
  }
}

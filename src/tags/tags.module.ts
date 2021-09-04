import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagsController } from './controllers/tags.controller';
import { Tag } from './entity/tag.entity';
import { TagsService } from './services/tags.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tag])],
  controllers: [TagsController],
  providers: [TagsService],
})
export class TagsModule {}

import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/user/auth/jwt-auth.guard';
import { CreateArticleDto } from '../dto/createArticle.dto';
import { ArticleService } from '../services/article.service';

@Controller('api')
export class ArticleController {
  constructor(private articleService: ArticleService) {}

  @UseGuards(JwtAuthGuard)
  @Get('articles/feed')
  async getArticleFavorited(@Request() req): Promise<any> {
    return this.articleService.getArticleFavorited(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/articles')
  async createArticle(
    @Body() bodys: CreateArticleDto,
    @Request() req,
  ): Promise<any> {
    console.log(req.user.id);
    // return null;
    return this.articleService.createArticle(bodys, req.user.id);
  }
  // /articles/{slug}
  @UseGuards(JwtAuthGuard)
  @Put('/articles/:slug')
  async update(@Body() bodys: CreateArticleDto, @Request() req): Promise<any> {
    console.log(req.user.id);
    // return null;
    return this.articleService.createArticle(bodys, req.user.id);
  }
}

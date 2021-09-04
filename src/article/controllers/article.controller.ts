import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { response } from 'express';
import { JwtAuthGuard } from 'src/user/auth/jwt-auth.guard';
import { CreateArticleDto } from '../dto/createArticle.dto';
import { ArticleService } from '../services/article.service';

@Controller('api')
export class ArticleController {
  constructor(private articleService: ArticleService) {}

  // get favorite article
  @ApiOperation({ summary: 'Create article' })
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 201,
    description: ' successfully ',
  })
  @Get('articles/feed')
  async getArticleFavorited(@Request() req): Promise<any> {
    return this.articleService.getArticleFavorited(req.user.id);
  }

  // create article
  @ApiOperation({ summary: 'Create an article' })
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 201,
    description: 'successfully created.',
  })
  @Post('articles')
  async createArticle(
    @Body() bodys: CreateArticleDto,
    @Request() req,
  ): Promise<any> {
    return this.articleService.createArticle(bodys, req.user.id);
  }

  // /articles/{slug} --- update
  // Update an article
  @ApiOperation({ summary: 'Update an article' })
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 201,
    description: 'successfully updated.',
  })
  @Put('articles/:slug')
  async update(
    @Body() bodys: CreateArticleDto,
    @Request() req,
    @Param() params,
  ): Promise<any> {
    return this.articleService.updateArticle(bodys, req.user.id, params.slug);
  }

  //Get an article
  // @UseGuards(JwtAuthGuard) option
  @ApiOperation({ summary: 'Get an article' })
  @ApiResponse({
    status: 201,
    description: 'successfully',
  })
  @Get('articles/:slug')
  async anArticle(@Param() params): Promise<any> {
    return this.articleService.getAnArticle(params.slug);
  }

  @ApiOperation({ summary: 'Delete an article' })
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 201,
    description: 'successfully delete.',
  })
  @Delete('articles/:slug')
  async deleteAritcle(@Param() params, @Request() res): Promise<any> {
    return this.articleService.deleteArticle(res.user.id, params.slug);
  }

  // Get recent articles globally
  @ApiOperation({ summary: 'Get recent articles globally' })
  @ApiResponse({
    status: 201,
    description: 'successfully.',
  })
  @Get('articles')
  async getGlobalArtilce(@Query() query) {
    console.log(query.q);
    return this.articleService.getGlobalArticle(query.q);
  }
  // --------------------------COMMENT-------------------------------

  @ApiOperation({ summary: 'Get comments for an article' })
  @ApiResponse({
    status: 201,
    description: 'OK',
  })
  @ApiResponse({
    status: 422,
    description: 'Unexpected error',
  })
  // @UseGuards(JwtAuthGuard)
  @Get('articles/:slug/comments')
  async getComment(@Param() params): Promise<any> {
    //
    return this.articleService.getCommentOfArticle(params.slug);
  }

  @ApiOperation({ summary: 'Create a comment for an article' })
  @ApiResponse({
    status: 201,
    description: 'OK',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 422,
    description: 'Unexpected error',
  })
  @UseGuards(JwtAuthGuard)
  @Post('articles/:slug/comments')
  async createComment(
    @Request() req,
    @Param() params,
    @Body() comment,
  ): Promise<any> {
    //
    return this.articleService.createComment(
      req.user.id,
      params.slug,
      comment.comment,
    );
  }

  @ApiOperation({ summary: 'Delete a comment for an article' })
  @ApiResponse({
    status: 201,
    description: 'OK',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 422,
    description: 'Unexpected error',
  })
  @UseGuards(JwtAuthGuard)
  @Delete('articles/:slug/comments/:id')
  async deleteComment(@Request() req, @Param() params): Promise<any> {
    //
    return this.articleService.deleteComment(
      req.user.id,
      params.slug,
      params.id,
    );
  }

  @ApiOperation({ summary: 'Favorite an article' })
  @ApiResponse({
    status: 201,
    description: 'OK',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 422,
    description: 'Unexpected error',
  })
  @UseGuards(JwtAuthGuard)
  @Post('articles/:slug/favorite')
  async favoriteAnArticle(@Request() req, @Param() params): Promise<any> {
    //
    return this.articleService.favoriteArticle(req.user.id, params.slug);
  }

  @ApiOperation({ summary: 'Unfavorite an article' })
  @ApiResponse({
    status: 201,
    description: 'OK',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 422,
    description: 'Unexpected error',
  })
  @UseGuards(JwtAuthGuard)
  @Delete('articles/{slug}/favorite')
  async UnfavoriteArticle(@Request() req, @Param() params): Promise<any> {
    //
    return this.articleService.unFavoriteArticle(req.user.id, params.slug);
  }

  @ApiOperation({ summary: 'Get tags' })
  @ApiResponse({
    status: 201,
    description: 'OK',
  })
  @ApiResponse({
    status: 422,
    description: 'Unexpected error',
  })
  // @UseGuards(JwtAuthGuard)
  @Get('tags')
  async getTags(): Promise<any> {
    return this.articleService.getTags();
  }
}

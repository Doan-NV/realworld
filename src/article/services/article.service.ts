import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileEntity } from 'src/profile/entities/follower.entity';
import { User } from 'src/user/entities/user.entity';

import { getRepository, Like, Repository } from 'typeorm';
import { CreateArticleDto } from '../dto/createArticle.dto';
import { UpdateArticleDto } from '../dto/updateArticle.dto';
import { Article } from '../entities/article.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(ProfileEntity)
    private profileEntity: Repository<ProfileEntity>,
  ) {}
  async getArticleFavorited(userId: number): Promise<any> {
    const listUserFollowing = await this.profileEntity.find({
      followerId: userId,
    });
    if (!listUserFollowing) {
      throw new HttpException(
        { message: 'no article you feed ' },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    } else {
      const users = listUserFollowing.map((user) => {
        return user.followingId;
      });
      const articles = await getRepository(Article)
        .createQueryBuilder('article')
        .where('authorId IN (:users)', { users })
        .leftJoinAndSelect('article.author', 'author')
        .skip(0) // bo qua bao nhieu thang
        .take(20) // lay bao nhieu thang
        .getMany();
      const responseArticle = articles.map((article) => {
        delete article.author.id;
        delete article.author.email;
        delete article.author.password;
        return article;
      });
      return responseArticle;
    }
  }

  async createArticle(
    articleData: CreateArticleDto,
    userId: number,
  ): Promise<any> {
    const article = new Article();
    article.title = articleData.title;
    article.body = articleData.body;
    article.description = articleData.description;
    article.tagList = articleData.taglist;

    const newArticle = await this.articleRepository.save(article);
    if (!newArticle) {
      throw new HttpException(
        { message: 'no article you need ' },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const author = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['article'],
    });
    author.article.push(article);
    await this.userRepository.save(author); // lưu userId vào db
    return newArticle;
  }

  async updateArticle(
    updateArticle: UpdateArticleDto,
    userId: number, // id tac gia
    slug: string,
  ): Promise<any> {
    const article = await getRepository(Article)
      .createQueryBuilder('article')
      .where('slug = :slug', { slug })
      .leftJoinAndSelect('article.author', 'author')
      .getOne();

    if (!article) {
      throw new HttpException(
        { message: 'no article you feed ' },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    if (article.author.id != userId) {
      throw new HttpException(
        { message: 'you can not update artilce' },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    article.title = updateArticle.title;
    article.body = updateArticle.body;
    article.description = updateArticle.description;
    article.updateAt = new Date();
    delete article.author.id;
    delete article.author.email;
    delete article.author.password;

    return article;
  }

  async getGlobalArticle(filter: string) {
    const globalArticle = await getRepository(Article)
      .createQueryBuilder('articles')
      .where({ title: Like(`%${filter}%`) }) // LIKE filter
      .leftJoinAndSelect('articles.author', 'author')
      .skip(0) // bo qua bao nhieu
      .take(20) // lay bao nhieu ket qua
      .getMany();
    return globalArticle;
  }

  async getProfileAuthor(userId: number): Promise<any> {
    const authorProfile = await this.userRepository.findOne({ id: userId });
    const author = {
      username: authorProfile.username,
      bio: authorProfile.bio,
      image: authorProfile.image,
      // following: true ????
    };
    return author;
  }

  async getAnArticle(slug: string) {
    const article = await getRepository(Article)
      .createQueryBuilder('articles')
      .where({ slug: slug })
      .leftJoinAndSelect('articles.author', 'author')
      .getOne();
    delete article.author.id;
    delete article.author.email;
    delete article.author.password;
    return article;
  }

  async deleteArticle(authorId: number, slug: string): Promise<any> {
    const article = await getRepository(Article)
      .createQueryBuilder('article')
      .where({ slug: slug })
      .leftJoinAndSelect('article.author', 'author')
      .getOne();
    if (article.author.id != authorId) {
      throw new HttpException(
        {
          message: 'you can not delete this article because you are not author',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const isDelete = await getRepository(Article)
      .createQueryBuilder()
      .delete()
      .from(Article)
      .where({ slug: slug })
      .execute();

    if (isDelete) {
      return HttpStatus.OK;
    }
  }

  // -------------------------------Comment---------------------------
  async createComment(
    authorCommentId: number,
    slug: string,
    comment: string,
  ): Promise<any> {
    //
  }

  async getCommentOfArticle(slug: string) {
    //
  }

  async deleteComment(
    authorIdOfComment: number,
    slug: string,
    idComment: number,
  ): Promise<any> {
    //
  }

  async favoriteArticle(userId: number, slug: string): Promise<any> {
    //
  }

  async unFavoriteArticle(userId: number, slug: string): Promise<any> {
    //
  }

  async getTags(): Promise<any> {
    //
  }
}

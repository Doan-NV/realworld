import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileEntity } from 'src/profile/entities/follower.entity';
import { User } from 'src/user/entities/user.entity';

import { getRepository, Repository } from 'typeorm';
import { CreateArticleDto } from '../dto/createArticle.dto';
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
    //   const articleFavorite = await getRepository(Article)
    //     .createQueryBuilder().leftJoinAndSelect("")

    const listUserFollowing = await this.profileEntity.find({
      followerId: userId,
    });
    if (!listUserFollowing) {
      throw new HttpException(
        { message: 'no article you feed ' },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    } else {
      console.log(listUserFollowing);

      const users = listUserFollowing.map((user) => {
        return user.followingId;
      });
      console.log(users);

      const article = await getRepository(Article)
        .createQueryBuilder()
        .where('authorId IN (:users)', { users })
        .skip(1)
        .take(20)
        .getMany();
      console.log(article);
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

    const author = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['article'],
    });
    author.article.push(article);
    await this.userRepository.save(author);
    return newArticle;
  }
}

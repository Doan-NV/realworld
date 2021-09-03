import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileEntity } from 'src/profile/entities/follower.entity';
import { User } from 'src/user/entities/user.entity';

import { getRepository, Repository } from 'typeorm';
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
        .createQueryBuilder()
        .where('authorId IN (:users)', { users })
        .skip(0) // bo qua bao nhieu thang
        .take(20) // lay bao nhieu thang
        .getMany();

      // tra ve khong co object tac gia
      // return articles;

      // trả về có author type profile {object}
      const author = await this.getProfileAuthor(userId);
      const responseArticle = articles.map((articles) => {
        articles.author = author;
        return articles;
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
    // return newArticle; // trả về nhưng không có object tác giả.....

    /// tra ve co object tac gia
    newArticle.author = {
      username: author.username,
      bio: author.bio,
      image: author.image,
      // following: true ????
    };
    return newArticle;
  }

  async updateArticle(
    slug: string,
    userId: number,
    updateArticle: UpdateArticleDto,
  ): Promise<any> {
    // title, description, body
    const article = await this.articleRepository.findOne({ slug: slug });
    if (!article) {
      throw new HttpException(
        { message: 'no article you feed ' },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    article.title = updateArticle.title;
    article.body = updateArticle.body;
    article.description = updateArticle.description;
    article.updateAt = new Date();
    // tra ve khong co object tac gia
    // return article;

    // tra ve co tac gia
    const author = await this.getProfileAuthor(userId);
    article.author = author;
    return article;
  }

  async getGlobalArticle() {}

  async getProfileAuthor(userId: number): Promise<any> {
    const authorProfile = await this.userRepository.findOne({ id: userId });
    const author = {
      username: authorProfile.username,
      bio: authorProfile.bio,
      image: authorProfile.image,
      // following: true ????
    };
    console.log(author);

    return author;
  }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/comment/entities/comment.entity';
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
    @InjectRepository(Comment)
    private commentEntity: Repository<Comment>,
  ) {}

  async getAllArticle(): Promise<any> {
    const articles = await getRepository(Article)
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author')
      .getMany();

    const responseArticles = articles.map((article) => {
      delete article.author.id;
      delete article.author.password;
      delete article.author.email;
      return article;
    });

    return { articles: responseArticles, articlesCount: articles.length };
  }
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
      return {
        articles: responseArticle,
        articlesCount: responseArticle.length,
      };
    }
  }
  async getArticleByTag(tag: string): Promise<any> {
    let articles = await getRepository(Article)
      .createQueryBuilder('articles')
      .where({ tagList: tag })
      .leftJoinAndSelect('articles.author', 'author')
      .getMany();
    const listArticle = articles.map((art) => {
      delete art.author.id;
      delete art.author.email;
      delete art.author.password;
      return art;
    });
    return { articles: listArticle, articlesCount: listArticle.length };
  }
  async getArticleByFavoritedName(
    favorited: string,
    userId: number,
  ): Promise<any> {
    //
    const { articles } = await this.getArticleFavorited(userId);
    const listarticle = await articles.filter((article) => {
      const isHave = article.author.username.indexOf(favorited) !== -1;
      return isHave;
    });
    return { articles: listarticle, articlesCount: listarticle.length };
  }
  async getArticleByAuthor(author: string): Promise<any> {
    let articles = await this.articleRepository.find({
      where: { author: { username: author } },
      relations: ['author'],
    });

    articles = articles.map((article) => {
      delete article.author.id;
      delete article.author.email;
      delete article.author.comments;
      delete article.author.password;
      return article;
    });
    return {
      articles: articles,
      articlesCount: articles.length,
    };
  }

  async createArticle(
    articleData: CreateArticleDto,
    userId: number,
  ): Promise<any> {
    const article = new Article();
    article.title = articleData.title;
    article.body = articleData.body;
    article.description = articleData.description;
    // article.tagList = articleData.taglist;

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
    updateArticle: any,
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
    console.log(article);

    const articleData = updateArticle.article;
    console.log(articleData.body);

    article.title = articleData.title ? articleData.title : article.title;
    article.body = articleData.body ? articleData.body : article.body;
    article.description = articleData.description
      ? articleData.description
      : article.body;
    console.log(article.body);

    delete article.author.id;
    delete article.author.email;
    delete article.author.password;
    console.log(article);

    await this.articleRepository.save(article);
    return { article };
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
    return { article: article };
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
    content: any,
  ): Promise<any> {
    console.log(content.body);

    // id , create at, update at, body, authorId, article id
    let newComment = new Comment();
    newComment.body = content.body;

    let author = await this.userRepository.findOne({
      where: { id: authorCommentId },
      relations: ['comments'],
    });

    let article = await this.articleRepository.findOne({
      where: { slug: slug },
      relations: ['comments'],
    });

    article.comments.push(newComment);
    author.comments.push(newComment);
    await this.commentEntity.save(newComment);
    article = await this.articleRepository.save(article);
    author = await this.userRepository.save(author);
    const comment = await this.commentEntity.findOne({
      where: { body: content.body },
      relations: ['author'],
    });
    delete comment.author.id;
    delete comment.author.password;
    delete comment.author.email;
    delete comment.author.comments;
    return { comment };
  }

  async getCommentOfArticle(slug: string) {
    //
    const article = await this.articleRepository.findOne({
      where: { slug: slug },
    });
    console.log(article.id);

    const comment = this.commentEntity.find({
      relations: ['author'],
      where: { article: { id: article.id } },
    });
    const listCmt = (await comment).map((cmt) => {
      delete cmt.author.id;
      delete cmt.author.email;
      delete cmt.author.password;
      delete cmt.author.comments;
      return cmt;
    });
    return { comments: listCmt };
  }

  async deleteComment(
    userId: number,
    slug: string,
    idComment: number,
  ): Promise<any> {
    //
    let article = await this.articleRepository.findOne({
      where: { slug: slug },
      relations: ['author'],
    });
    console.log(article);

    const comment = await this.commentEntity.findOne({
      where: { id: idComment, article: { id: article.id } },
      relations: ['author'],
    });
    if (article.author.id == userId || comment.author.id == userId) {
      await getRepository(Comment)
        .createQueryBuilder()
        .delete()
        .where({ id: idComment })
        .execute();
      return HttpStatus.OK;
    } else {
      return HttpStatus.UNAUTHORIZED;
    }
  }

  async favoriteArticle(userId: number, slug: string): Promise<any> {
    //
    const article = await this.articleRepository.findOne({
      where: { slug: slug },
      relations: ['author'],
    });
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['favorites'],
    });
    user.favorites.push(article);
    article.favorited = true;
    article.favoritesCount += 1;
    await this.userRepository.save(user);
    return { article };
  }

  async unFavoriteArticle(userId: number, slug: string): Promise<any> {
    //
    const article = await this.articleRepository.findOne({
      where: { slug: slug },
      relations: ['author'],
    });
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['favorites'],
    });
    user.favorites = user.favorites.filter((art) => {
      return art.id !== article.id;
    });
    article.favorited = false;
    article.favoritesCount -= 1;
    await this.userRepository.save(user);
    return { article };
  }

  async getTags(): Promise<any> {
    //
  }
}

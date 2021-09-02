import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileEntity } from 'src/profile/entities/follower.entity';
import { ProfileModule } from 'src/profile/profile.module';
import { User } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import { ArticleController } from './controllers/article.controller';
import { Article } from './entities/article.entity';
import { ArticleService } from './services/article.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Article, User, ProfileEntity]),
    UserModule,
    ProfileModule,
  ],
  providers: [ArticleService],
  controllers: [ArticleController],
})
export class ArticleModule {}

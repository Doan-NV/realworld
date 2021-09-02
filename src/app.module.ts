import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ArticleService } from './article/services/article.service';
import { ArticleController } from './article/controllers/article.controller';
import { ArticleModule } from './article/article.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileController } from './profile/controllers/profile.controller';
import { ProfileModule } from './profile/profile.module';
import { TagsController } from './tags/controllers/tags.controller';
import { TagsService } from './tags/services/tags.service';
import { TagsModule } from './tags/tags.module';
import { ProfileService } from './profile/services/profile.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    UserModule,
    ArticleModule,
    ProfileModule,
    TagsModule,
  ],
  controllers: [
    AppController,
    // ArticleController,
    // ProfileController,
    // TagsController,
  ],
  // providers: [AppService, ArticleService, TagsService, ProfileService],
  providers: [AppService],
})
export class AppModule {
  // constructor(private connection: Connection) {}
}

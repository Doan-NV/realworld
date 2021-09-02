import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import { ProfileController } from './controllers/profile.controller';
import { ProfileEntity } from './entities/follower.entity';
import { ProfileService } from './services/profile.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProfileEntity, User]), UserModule],
  providers: [ProfileService, ProfileModule],
  controllers: [ProfileController],
})
export class ProfileModule {}

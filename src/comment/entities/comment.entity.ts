import { Article } from 'src/article/entities/article.entity';
import { User } from 'src/user/entities/user.entity';
import {
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('comment')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @BeforeUpdate()
  update() {
    this.updatedAt = new Date();
  }
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column()
  body: string;

  // 1 bài viết có nhiều bình luận
  @ManyToOne(() => Article, (article) => article.comments)
  article: Article;

  // 1 người có nhiều bình luận
  @ManyToOne(() => User, (author) => author.comments)
  author: User;
}

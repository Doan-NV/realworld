import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Article } from 'src/article/entities/article.entity';
import { Comment } from 'src/comment/entities/comment.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  username: string;

  // khi insert thi hash truoc
  // @BeforeInsert()
  // async hashPassword() {
  //   this.password = await bcrypt.hash(this.password, 10);
  // }
  @Column()
  password: string;

  @Column({ default: '' })
  bio: string;

  @Column({ default: '' })
  image: string;

  // 1 thằng có thể thích nhiều bài bào,
  // nhiều thằng có thể thích nhiều bài báo
  @ManyToMany(() => Article)
  @JoinTable()
  favorites: Article[];

  // 1 người có thể có nhiều bài báo
  @OneToMany(() => Article, (article) => article.author)
  article: Article[];

  // 1 người có thể có nhiều bình luận ở nhiều bài viết khác nhau
  @OneToMany(() => Comment, (comment) => comment.author)
  comment: Comment[];
}

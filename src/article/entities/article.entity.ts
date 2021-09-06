import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeUpdate,
  ManyToOne,
  OneToMany,
  JoinColumn,
  BeforeInsert,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { ProfileEntity } from 'src/profile/entities/follower.entity';
@Entity('article')
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ default: '' })
  slug: string;

  @Column()
  description: string;

  @Column()
  body: string;

  @BeforeInsert()
  insertCreate() {
    this.updatedAt = new Date();
  }
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @BeforeUpdate()
  update() {
    this.updatedAt = new Date();
  }
  @BeforeInsert()
  insert() {
    this.updatedAt = new Date();
  }
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  // @Column({ default: ' ' })
  // tagList: string;
  @Column('simple-array')
  tagList: string[];

  //  1 người có thể có nhiều bài báo || nhiều bài báo của 1 người
  @ManyToOne(() => User, (user) => user.article)
  author: User; // object

  // 1 bài viết có thể có nhiều bình luận
  @OneToMany(() => Comment, (commnet) => commnet.article, { eager: true })
  comments: Comment[];

  @Column({ default: false })
  favorited: boolean;

  @Column({ default: 0 })
  favoritesCount: number;
}

import {
  Field,
  GraphQLISODateTime,
  ID,
  Int,
  ObjectType,
} from '@nestjs/graphql';
import { User } from 'src/user/user.entity';
import { Forest } from 'src/forest/forest.entity';
import { Likeable } from 'src/like/interfaces/likeable.interface';
import { LikeableEntityType } from 'src/like/enums/likeable-entity-type.enum';
import { Like } from 'src/like/like.entity';
import { Commentable } from 'src/comment/interfaces/commentable.interface';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Comment } from 'src/comment/comment.entity';

@Entity()
@ObjectType({
  implements: () => [Likeable, Commentable],
})
export class Story implements Likeable, Commentable {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  likeableEntityType: LikeableEntityType;

  @Column()
  @Index()
  @Field()
  title: string;

  @Column({ type: 'text' })
  @Index()
  @Field()
  content: string;

  @ManyToOne(() => User, (user) => user.stories)
  author: User;

  @Column()
  @Index()
  authorId: number;

  @OneToMany(() => Story, (chapter) => chapter.parent)
  parent?: Story;

  @Column({ nullable: true })
  @Index()
  parentId?: number;

  @OneToMany(() => Story, (root) => root.descendents)
  root?: Story;

  @Column({ nullable: true })
  @Index()
  rootId?: number;

  @ManyToOne(() => Story, (parent) => parent.chapters)
  chapters: Story[];

  @Column({ type: 'simple-array' })
  @Index()
  @Field(() => [String], { nullable: true, defaultValue: [] })
  tags: string[];

  @ManyToOne(() => Forest, (forest) => forest.stories)
  forest?: Forest;

  @ManyToOne(() => Story, (chapter) => chapter.root)
  descendents: Story[];

  @Column({ nullable: true })
  @Index()
  forestId?: number;

  @OneToMany(() => Like, (like) => like.entity)
  likes: Like[];

  @OneToMany(() => Comment, (comment) => comment.entity)
  comments: Comment[];

  @Field(() => Int, { defaultValue: 0 })
  commentsCount: number;

  @Field(() => Int, { defaultValue: 0 })
  likesCount: number;

  @Field(() => Int, { defaultValue: 0 })
  descendentsCount: number;

  @Field(() => Int, { defaultValue: 0 })
  childrenCount: number;

  @Field(() => Like, { nullable: true })
  currentUserLike: Like;

  @CreateDateColumn()
  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
}

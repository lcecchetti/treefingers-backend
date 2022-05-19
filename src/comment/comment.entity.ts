import {
  Field,
  GraphQLISODateTime,
  ID,
  Int,
  ObjectType,
} from '@nestjs/graphql';
import { User } from 'src/user/user.entity';
import { Likeable } from 'src/like/interfaces/likeable.interface';
import { LikeableEntityType } from 'src/like/enums/likeable-entity-type.enum';
import { Like } from 'src/like/like.entity';
import { CommentableEntityType } from './enums/commentable-entity-type.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  TableInheritance,
  UpdateDateColumn,
} from 'typeorm';
import { CommentLike } from 'src/like/comment-like.entity';
import { Commentable } from './interfaces/commentable.interface';

@Entity()
@TableInheritance({
  column: { type: 'enum', name: 'entityType', enum: CommentableEntityType },
})
@Index(['entityType', 'entityId'])
@ObjectType({
  implements: () => [Likeable],
})
export class Comment implements Likeable {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column({ type: 'text' })
  @Field()
  content: string;

  @ManyToOne(() => User, (user) => user.comments)
  @Field(() => User)
  user: User;

  @Column()
  @Index()
  userId: number;

  @Field(() => CommentableEntityType)
  entityType: CommentableEntityType;

  @Field(() => Commentable)
  entity: Commentable;

  @Column()
  entityId: number;

  @Field(() => Int, { defaultValue: 0 })
  likesCount: number;

  @Field(() => Like, { nullable: true })
  currentUserLike: Like;

  @OneToMany(() => CommentLike, (like) => like.entity)
  likes: Like[];

  @CreateDateColumn()
  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
}

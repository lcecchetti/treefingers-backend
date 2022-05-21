import {
  Field,
  GraphQLISODateTime,
  ID,
  Int,
  ObjectType,
} from '@nestjs/graphql';
import { User } from 'src/user/user.entity';
import { Likeable } from 'src/like/interfaces/likeable.interface';
import { Like } from 'src/like/like.entity';
import { CommentableEntityType } from './enums/commentable-entity-type.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Commentable } from './interfaces/commentable.interface';

@Entity()
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

  @Column({ type: 'enum', name: 'entityType', enum: CommentableEntityType })
  @Field(() => CommentableEntityType)
  entityType: CommentableEntityType;

  @Field(() => Commentable)
  entity: Commentable;

  @Column()
  @Index()
  entityId: number;

  @Field(() => Int, { defaultValue: 0 })
  likesCount: number;

  @Field(() => Like, { nullable: true })
  currentUserLike: Like;

  @CreateDateColumn()
  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
}

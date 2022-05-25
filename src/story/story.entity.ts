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
import { Like } from 'src/like/like.entity';
import { Commentable } from 'src/comment/interfaces/commentable.interface';
import {
  ArrayType,
  Entity,
  Index,
  ManyToOne,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';

@Entity()
@ObjectType({
  implements: () => [Likeable, Commentable],
})
export class Story implements Likeable, Commentable {
  @PrimaryKey()
  @Field(() => ID)
  id: number;

  @Property()
  @Index()
  @Field()
  title: string;

  @Property({ type: 'text' })
  @Index()
  @Field()
  content: string;

  @ManyToOne(() => User)
  @Index()
  author: User;

  @ManyToOne(() => Story, { nullable: true })
  @Index()
  parent?: Story;

  @ManyToOne(() => Story, { nullable: true })
  @Index()
  root?: Story;

  @Property({ type: ArrayType })
  @Index()
  @Field(() => [String], { nullable: true, defaultValue: [] })
  tags: string[];

  @ManyToOne(() => Forest, { nullable: true })
  @Index()
  forest?: Forest;

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

  @Property({ onCreate: () => new Date() })
  @Field(() => GraphQLISODateTime)
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  @Field(() => GraphQLISODateTime)
  updatedAt: Date = new Date();
}

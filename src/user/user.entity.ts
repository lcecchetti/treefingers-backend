import {
  Field,
  GraphQLISODateTime,
  ID,
  Int,
  ObjectType,
} from '@nestjs/graphql';
import { isPrivateMiddleware } from './middleware/is-private.middleware';
import { Entity, Index, PrimaryKey, Property, Unique } from '@mikro-orm/core';

@Entity()
@ObjectType()
export class User {
  @PrimaryKey()
  @Field(() => ID)
  id: number;

  @Property()
  @Unique()
  @Field({ middleware: [isPrivateMiddleware] })
  email: string;

  @Property()
  password?: string;

  @Property()
  @Unique()
  @Field()
  username: string;

  @Property({ type: 'text', nullable: true })
  @Index()
  @Field({ nullable: true })
  bio?: string;

  @Property({ default: false })
  @Index()
  @Field({ defaultValue: false })
  isActive: boolean;

  @Field(() => Int, { defaultValue: 0 })
  likesCount: number;

  @Field(() => Int, { defaultValue: 0 })
  storiesCount: number;

  @Field(() => Int, { defaultValue: 0 })
  followersCount: number;

  @Property({ onCreate: () => new Date() })
  @Field(() => GraphQLISODateTime)
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  @Field(() => GraphQLISODateTime)
  updatedAt: Date = new Date();
}

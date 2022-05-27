import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql';
import { isPrivateMiddleware } from './middleware/is-private.middleware';
import {
  Entity,
  Formula,
  Index,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { EncodedID } from 'src/common/scalars/encoded-id.scalar';

@Entity()
@ObjectType()
export class User {
  @PrimaryKey()
  @Field(() => EncodedID)
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

  @Formula(
    '(select count(distinct s.id) as cnt from story as s where s.author_id = u0.id)',
  )
  @Field(() => Int, { defaultValue: 0 })
  storiesCount: number;

  @Formula(
    '(select count(distinct f.id) as cnt from followership as f where f.followed_id = u0.id)',
  )
  @Field(() => Int, { defaultValue: 0 })
  followersCount: number;

  @Property({ onCreate: () => new Date() })
  @Field(() => GraphQLISODateTime)
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  @Field(() => GraphQLISODateTime)
  updatedAt: Date = new Date();
}

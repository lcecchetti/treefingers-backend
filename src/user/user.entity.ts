import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql';
import { isPrivateMiddleware } from './middleware/is-private.middleware';
import {
  Collection,
  Entity,
  Formula,
  Index,
  OneToMany,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { EncodedID } from '../common/scalars/encoded-id.scalar';
import { Followership } from '../followership/followership.entity';

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

  @Property({ default: false })
  @Index()
  isBanned: boolean;

  // bumped whenever the password changes, to invalidate outstanding
  // forgot-password links without embedding the password hash in them
  @Property({ default: 0 })
  tokenVersion = 0;

  @Formula(
    '(select count(distinct s.id) as cnt from story as s where s.author_id = u0.id and s.parent_id is null)',
  )
  @Field(() => Int, { defaultValue: 0 })
  storiesCount: number;

  @OneToMany(() => Followership, (followership) => followership.follower)
  followershipsAsFollower = new Collection<Followership>(this);

  @OneToMany(() => Followership, (followership) => followership.followed)
  followershipsAsFollowed = new Collection<Followership>(this);

  @Formula(
    '(select count(distinct f.id) as cnt from followership as f where f.followed_id = u0.id)',
  )
  @Field(() => Int, { defaultValue: 0 })
  followersCount: number;

  @Property({ nullable: true })
  @Field(() => GraphQLISODateTime, { nullable: true })
  lastLogin?: Date;

  @Property({ onCreate: () => new Date() })
  @Field(() => GraphQLISODateTime)
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  @Field(() => GraphQLISODateTime)
  updatedAt: Date = new Date();
}

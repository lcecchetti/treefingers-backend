import {
  Field,
  GraphQLISODateTime,
  ID,
  Int,
  ObjectType,
} from '@nestjs/graphql';
import { isPrivateMiddleware } from './middleware/is-private.middleware';
import { Followership } from 'src/followership/followership.entity';
import { Forest } from 'src/forest/forest.entity';
import { Comment } from 'src/comment/comment.entity';
import { Like } from 'src/like/like.entity';
import { Membership } from 'src/membership/membership.entity';
import { Story } from 'src/story/story.entity';
import {
  Entity,
  Index,
  OneToMany,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';

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

  @OneToMany(() => Followership, (followership) => followership.followed)
  followershipsAsFollowed: Followership[];

  @OneToMany(() => Followership, (followership) => followership.follower)
  followershipsAsFollower: Followership[];

  @OneToMany(() => Forest, (forest) => forest.founder)
  forests: Forest[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.user)
  likes: Comment[];

  @OneToMany(() => Membership, (membership) => membership.member)
  memberships: Membership[];

  @OneToMany(() => Story, (story) => story.author)
  stories: Story[];

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

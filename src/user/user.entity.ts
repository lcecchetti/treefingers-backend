import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { isPrivateMiddleware } from './middleware/is-private.middleware';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Followership } from 'src/followership/followership.entity';
import { Forest } from 'src/forest/forest.entity';
import { Comment } from 'src/comment/comment.entity';
import { Like } from 'src/like/like.entity';
import { Membership } from 'src/membership/membership.entity';
import { Story } from 'src/story/story.entity';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  @Index({ unique: true })
  @Field({ middleware: [isPrivateMiddleware] })
  email: string;

  @Column()
  password?: string;

  @Column()
  @Index({ unique: true })
  @Field()
  username: string;

  @Column({ type: 'text', nullable: true })
  @Index()
  @Field({ nullable: true })
  bio?: string;

  @Column({ default: false })
  @Index()
  @Field({ defaultValue: false })
  isActive: boolean;

  @OneToMany(() => Followership, (followership) => followership.followed)
  followershipsAsFollowed: Followership;

  @OneToMany(() => Followership, (followership) => followership.follower)
  followershipsAsFollower: Followership;

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

  @CreateDateColumn()
  @Field(() => GraphQLISODateTime, { middleware: [isPrivateMiddleware] })
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => GraphQLISODateTime, { middleware: [isPrivateMiddleware] })
  updatedAt: Date;
}

import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@Index(['followedId', 'followerId'], { unique: true })
@ObjectType()
export class Followership {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @OneToMany(() => User, (user) => user.followershipsAsFollowed)
  @JoinColumn()
  @Field(() => User)
  followed: User;

  @Column()
  @Index()
  followedId: number;

  @OneToMany(() => User, (user) => user.followershipsAsFollower)
  @JoinColumn()
  @Field(() => User)
  follower: User;

  @Column()
  @Index()
  followerId: number;

  @CreateDateColumn()
  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
}

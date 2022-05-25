import {
  Entity,
  Index,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/user.entity';

@Entity()
@Unique({ properties: ['followed', 'follower'] })
@ObjectType()
export class Followership {
  @PrimaryKey()
  @Field(() => ID)
  id: number;

  @ManyToOne(() => User)
  @Index()
  @Field(() => User)
  followed: User;

  @ManyToOne(() => User)
  @Index()
  @Field(() => User)
  follower: User;

  @Property({ onCreate: () => new Date() })
  @Field(() => GraphQLISODateTime)
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  @Field(() => GraphQLISODateTime)
  updatedAt: Date = new Date();
}

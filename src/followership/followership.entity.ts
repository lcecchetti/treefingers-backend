import {
  Entity,
  Index,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import { HashedIDScalar } from 'src/common/scalars/hashed-id.scalar';
import { User } from 'src/user/user.entity';

@Entity()
@Unique({ properties: ['followed', 'follower'] })
@ObjectType()
export class Followership {
  @PrimaryKey()
  @Field(() => HashedIDScalar)
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

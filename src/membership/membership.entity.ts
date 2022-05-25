import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/user.entity';
import { Forest } from 'src/forest/forest.entity';
import {
  Entity,
  Index,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';

@Entity()
@Unique({ properties: ['member', 'forest'] })
@ObjectType()
export class Membership {
  @PrimaryKey()
  @Field(() => ID)
  id: number;

  @ManyToOne(() => Forest)
  @Index()
  @Field(() => Forest)
  forest: Forest;

  @ManyToOne(() => User)
  @Index()
  @Field(() => User)
  member: User;

  @Property({ onCreate: () => new Date() })
  @Field(() => GraphQLISODateTime)
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  @Field(() => GraphQLISODateTime)
  updatedAt: Date = new Date();
}

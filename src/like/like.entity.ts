import {
  Entity,
  Enum,
  Index,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/user.entity';
import { LikeableEntityType } from './enums/likeable-entity-type.enum';
import { Likeable } from './interfaces/likeable.interface';

@Entity()
@Unique({ properties: ['user', 'entity', 'entityType'] })
@Index({ properties: ['entity', 'entityType'] })
@ObjectType()
export class Like {
  @PrimaryKey()
  @Field(() => ID)
  id: number;

  @Enum(() => LikeableEntityType)
  @Field(() => LikeableEntityType)
  entityType: LikeableEntityType;

  @Property()
  @Field(() => Likeable)
  entity: Likeable;

  @ManyToOne(() => User)
  @Index()
  @Field(() => User)
  user: User;

  @Property({ onCreate: () => new Date() })
  @Field(() => GraphQLISODateTime)
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  @Field(() => GraphQLISODateTime)
  updatedAt: Date = new Date();
}

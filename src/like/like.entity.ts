import {
  Entity,
  Enum,
  Index,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import { EncodedID } from 'src/common/scalars/encoded-id.scalar';
import { User } from 'src/user/user.entity';
import { LikeableEntityType } from './enums/likeable-entity-type.enum';

@Entity()
@Unique({ properties: ['user', 'entity', 'entityType'] })
@Index({ properties: ['entity', 'entityType'] })
@ObjectType()
export class Like {
  @PrimaryKey()
  @Field(() => EncodedID)
  id: number;

  @Enum(() => LikeableEntityType)
  @Index()
  @Field(() => LikeableEntityType)
  entityType: LikeableEntityType;

  @Property({ type: 'number' })
  @Index()
  entity: number;

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

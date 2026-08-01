import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import { User } from '../user/user.entity';
import { Forest } from '../forest/forest.entity';
import {
  Entity,
  Index,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/decorators/legacy';
import { EncodedID } from '../common/scalars/encoded-id.scalar';

@Entity()
@Unique({ properties: ['member', 'forest'] })
@ObjectType()
export class Membership {
  @PrimaryKey()
  @Field(() => EncodedID)
  id: number;

  @ManyToOne(() => Forest, { deleteRule: 'cascade' })
  @Index()
  @Field(() => Forest)
  forest: Forest;

  @ManyToOne(() => User, { deleteRule: 'cascade' })
  @Index()
  @Field(() => User)
  member: User;

  @Property({ onCreate: () => new Date(), length: 0 })
  @Field(() => GraphQLISODateTime)
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date(), length: 0 })
  @Field(() => GraphQLISODateTime)
  updatedAt: Date = new Date();
}

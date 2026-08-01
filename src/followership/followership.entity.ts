import {
  Entity,
  Index,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/decorators/legacy';
import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import { EncodedID } from '../common/scalars/encoded-id.scalar';
import { User } from '../user/user.entity';

@Entity()
@Unique({ properties: ['followed', 'follower'] })
@ObjectType()
export class Followership {
  @PrimaryKey()
  @Field(() => EncodedID)
  id: number;

  @ManyToOne(() => User, { deleteRule: 'cascade' })
  @Index()
  @Field(() => User)
  followed: User;

  @ManyToOne(() => User, { deleteRule: 'cascade' })
  @Index()
  @Field(() => User)
  follower: User;

  @Property({ onCreate: () => new Date(), length: 0 })
  @Field(() => GraphQLISODateTime)
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date(), length: 0 })
  @Field(() => GraphQLISODateTime)
  updatedAt: Date = new Date();
}

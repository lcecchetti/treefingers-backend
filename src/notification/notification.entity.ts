import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql';
import { User } from '../user/user.entity';
import {
  Entity,
  Enum,
  Index,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/decorators/legacy';
import { EncodedID } from '../common/scalars/encoded-id.scalar';
import { NotificationType } from './enum/notification-type.enum';

@Entity()
@Index({
  properties: ['user', 'type', 'targetId', 'read'],
})
@Index({
  properties: ['user', 'type', 'actor', 'targetId'],
})
@ObjectType()
export class Notification {
  @PrimaryKey()
  @Field(() => EncodedID)
  id: number;

  @Property({ default: false })
  @Index()
  @Field()
  read: boolean;

  @Property({ nullable: true })
  @Field(() => String, { nullable: true })
  link?: string;

  @Property()
  @Field(() => String)
  content: string;

  @Enum(() => NotificationType)
  @Field(() => NotificationType)
  type: NotificationType;

  @ManyToOne(() => User, { deleteRule: 'cascade', nullable: true })
  @Field(() => User, { nullable: true })
  actor?: User;

  @Property({ nullable: true })
  @Field(() => EncodedID, { nullable: true })
  sourceId?: number;

  @Property({ nullable: true })
  @Field(() => EncodedID, { nullable: true })
  targetId?: number;

  @ManyToOne(() => User, { deleteRule: 'cascade' })
  @Index()
  @Field(() => User)
  user: User;

  @Field(() => Int, { defaultValue: 0 })
  count: number;

  @Property({ onCreate: () => new Date(), length: 0 })
  @Field(() => GraphQLISODateTime)
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date(), length: 0 })
  @Field(() => GraphQLISODateTime)
  updatedAt: Date = new Date();
}

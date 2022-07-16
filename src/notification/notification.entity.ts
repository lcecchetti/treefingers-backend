import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql';
import { User } from '../user/user.entity';
import {
  Entity,
  Enum,
  Index,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { EncodedID } from '../common/scalars/encoded-id.scalar';
import { NotificationType } from './enum/notification-type.enum';

@Entity()
@Index({
  properties: ['actor', 'type', 'targetId', 'read'],
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

  @ManyToOne(() => User, { onDelete: 'cascade', nullable: true })
  @Field(() => User, { nullable: true })
  actor?: User;

  @Property({ nullable: true })
  @Field(() => EncodedID, { nullable: true })
  sourceId?: number;

  @Property({ nullable: true })
  @Field(() => EncodedID, { nullable: true })
  targetId?: number;

  @ManyToOne(() => User, { onDelete: 'cascade' })
  @Index()
  @Field(() => User)
  user: User;

  @Field(() => Int, { defaultValue: 0 })
  count: number;

  @Property({ onCreate: () => new Date() })
  @Field(() => GraphQLISODateTime)
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  @Field(() => GraphQLISODateTime)
  updatedAt: Date = new Date();
}

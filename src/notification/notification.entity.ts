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
import { NotificationReferenceType } from './enum/notification-reference-type.enum';
import { NotificationWhat } from './enum/notification-what.enum';
import { NotificationDetails } from './dto/notification-details';
import { NotificationSourceType } from './enum/notification-source-type.enum';

@Entity()
@Index({ properties: ['what', 'who', 'referenceId', 'referenceType'] })
@ObjectType()
export class Notification {
  @PrimaryKey()
  @Field(() => EncodedID)
  id: number;

  @Property({ default: false })
  @Index()
  @Field()
  read: boolean;

  @Enum(() => NotificationWhat)
  @Field(() => NotificationWhat)
  what: NotificationWhat;

  @ManyToOne(() => User, { onDelete: 'cascade', nullable: true })
  @Field(() => User, { nullable: true })
  who?: User;

  @Property({ nullable: true })
  @Field(() => EncodedID, { nullable: true })
  sourceId?: number;

  @Enum({ items: () => NotificationSourceType, nullable: true })
  @Field(() => NotificationSourceType, { nullable: true })
  sourceType?: NotificationSourceType;

  @Property({ nullable: true })
  @Field(() => EncodedID, { nullable: true })
  referenceId?: number;

  @Enum({ items: () => NotificationReferenceType, nullable: true })
  @Field(() => NotificationReferenceType, { nullable: true })
  referenceType?: NotificationReferenceType;

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

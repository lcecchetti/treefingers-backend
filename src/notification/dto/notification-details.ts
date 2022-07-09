import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class NotificationDetails {
  @Field({ nullable: true })
  referenceLabel?: string;

  @Field({ nullable: true })
  sourceLabel?: string;
}

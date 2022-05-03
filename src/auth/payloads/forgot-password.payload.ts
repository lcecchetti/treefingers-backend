import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ResetPassowrdPayload {
  @Field()
  emailSent: boolean;
}

import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RecoverPassowrdPayload {
  @Field()
  emailSent: boolean;
}

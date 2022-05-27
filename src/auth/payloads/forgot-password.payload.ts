import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ForgotPasswordPayload {
  @Field()
  result: boolean;
}

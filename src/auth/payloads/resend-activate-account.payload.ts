import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ResendActivateAccountPayload {
  @Field()
  result: boolean;
}

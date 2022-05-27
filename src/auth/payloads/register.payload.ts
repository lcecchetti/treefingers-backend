import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RegisterPayload {
  @Field()
  result: boolean;
}

import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LoginPayload {
  @Field()
  token: string;
}

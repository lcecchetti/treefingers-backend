import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LogoutPayload {
  @Field()
  result: boolean;
}

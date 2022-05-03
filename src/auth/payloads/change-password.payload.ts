import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ChangePasswordPayload {
  @Field()
  passwordChanged: boolean;
}

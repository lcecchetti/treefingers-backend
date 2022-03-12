import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CurrentUser {
  @Field(() => ID)
  _id: string;

  @Field()
  username: string;

  @Field()
  email: string;
}

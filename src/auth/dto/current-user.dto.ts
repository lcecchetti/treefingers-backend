import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CurrentUser {
  @Field(() => ID)
  id: number;

  @Field()
  username: string;

  @Field()
  email: string;
}

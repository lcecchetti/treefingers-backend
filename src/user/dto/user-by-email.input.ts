import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UserByEmailInput {
  @Field()
  readonly email: string;
}

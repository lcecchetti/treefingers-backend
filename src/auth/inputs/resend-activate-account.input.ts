import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ResendActivateAccountInput {
  @Field()
  readonly email: string;
}

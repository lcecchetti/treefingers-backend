import { InputType, ArgsType, Field } from '@nestjs/graphql';
import { UserFilterInput } from './user-filter.input';

@InputType()
@ArgsType()
export class UserInput {
  @Field(() => UserFilterInput, { nullable: true })
  filter?: UserFilterInput = new UserFilterInput();
}

import { Field, InputType } from '@nestjs/graphql';
import { CreateUserDataInput } from './create-user.input';
import { UserFilterInput } from './user-filter.input';

@InputType()
export class UpdateUserDataInput extends CreateUserDataInput {}

@InputType()
export class UpdateUserInput {
  @Field(() => UpdateUserDataInput)
  data: UpdateUserDataInput;

  @Field(() => UserFilterInput)
  filter: UserFilterInput;
}

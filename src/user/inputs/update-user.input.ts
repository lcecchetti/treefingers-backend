import { Field, InputType } from '@nestjs/graphql';
import { CreateUserDataInput } from './create-user.input';
import { FilterUserInput } from './filter-user.input';

@InputType()
export class UpdateUserDataInput extends CreateUserDataInput {}

@InputType()
export class UpdateUserInput {
  @Field(() => UpdateUserDataInput)
  data: UpdateUserDataInput;

  @Field(() => FilterUserInput)
  filter: FilterUserInput;
}

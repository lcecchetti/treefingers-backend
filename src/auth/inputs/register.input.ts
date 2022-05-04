import { Field, InputType } from '@nestjs/graphql';
import { CreateUserInputData } from 'src/user/inputs/create-user.input';

@InputType()
export class RegisterDataInput extends CreateUserInputData {}

@InputType()
export class RegisterInput {
  @Field()
  data: RegisterDataInput;
}

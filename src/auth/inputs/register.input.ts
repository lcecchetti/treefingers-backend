import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { CreateUserInputData } from 'src/user/inputs/create-user.input';

@InputType()
export class RegisterDataInput extends CreateUserInputData {}

@InputType()
export class RegisterInput {
  @Field()
  @ValidateNested()
  @Type(() => RegisterDataInput)
  data: RegisterDataInput;
}

import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsEmail,
  Length,
  Matches,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { EditUserDataInput } from './edit-user.input';

@InputType()
export class CreateUserInputData extends EditUserDataInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @Length(3, 20)
  @Matches(/^[a-zA-Z0-9-_]+$/)
  username: string;

  // required on creation, unlike EditUserDataInput's optional password
  @Field()
  @MinLength(10)
  password: string;
}

@InputType()
export class CreateUserInput {
  @Field()
  @ValidateNested()
  @Type(() => CreateUserInput)
  data: CreateUserInput;
}

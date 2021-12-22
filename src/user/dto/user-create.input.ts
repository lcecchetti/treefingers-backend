import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, MinLength } from 'class-validator';

@InputType()
export class UserCreateDataInput {
  @Field()
  @IsEmail()
  readonly email: string;

  @Field()
  @MinLength(10)
  readonly password: string;
}

@InputType()
export class UserCreateInput {
  @Field()
  data: UserCreateDataInput;
}

import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, Length, MinLength } from 'class-validator';

@InputType()
export class CreateUserDataInput {
  @Field()
  @IsEmail()
  readonly email: string;

  @Field()
  @MinLength(10)
  readonly password: string;

  @Field()
  @Length(2, 32)
  readonly pseudonym: string;

  username?: string;
}

@InputType()
export class CreateUserInput {
  @Field()
  data: CreateUserDataInput;
}

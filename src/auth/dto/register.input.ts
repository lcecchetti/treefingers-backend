import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, MinLength } from 'class-validator';

@InputType()
export class RegisterInput {
  @Field()
  @IsEmail()
  readonly email: string;

  @Field()
  @MinLength(10)
  readonly password: string;
}

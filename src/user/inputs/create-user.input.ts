import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

@InputType()
export class CreateUserInputData {
  @Field()
  @IsEmail()
  readonly email: string;

  @Field()
  @MinLength(10)
  password: string;

  @Field()
  @Length(3, 20)
  @Matches(/^[a-zA-Z0-9-_]+$/)
  readonly username: string;

  @Field({ nullable: true })
  @MaxLength(4096)
  readonly bio?: string;
}

@InputType()
export class CreateUserInput {
  @Field()
  data: CreateUserInput;
}

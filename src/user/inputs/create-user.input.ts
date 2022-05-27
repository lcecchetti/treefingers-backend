import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsEmail,
  Length,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

@InputType()
export class CreateUserInputData {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @MinLength(10)
  password: string;

  @Field()
  @Length(3, 20)
  @Matches(/^[a-zA-Z0-9-_]+$/)
  username: string;

  @Field({ nullable: true })
  @MaxLength(4096)
  bio?: string;
}

@InputType()
export class CreateUserInput {
  @Field()
  @ValidateNested()
  @Type(() => CreateUserInput)
  data: CreateUserInput;
}

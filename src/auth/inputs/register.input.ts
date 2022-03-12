import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

@InputType()
class RegisterDataInput {
  @Field()
  @IsEmail()
  readonly email: string;

  @Field()
  @MinLength(10)
  password: string;

  @Field()
  @Length(2, 32)
  @Matches(/^[a-zA-Z0-9-_]+$/)
  readonly username: string;

  @Field({ nullable: true })
  @MaxLength(255)
  readonly bio?: string;
}

@InputType()
export class RegisterInput {
  @Field()
  data: RegisterDataInput;
}

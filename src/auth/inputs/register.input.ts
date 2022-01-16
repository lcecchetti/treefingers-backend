import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, Length, MaxLength, MinLength } from 'class-validator';

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
  readonly pseudonym: string;

  @Field({ nullable: true })
  @MaxLength(255)
  readonly bio?: string;
}

@InputType()
export class RegisterInput {
  @Field()
  data: RegisterDataInput;
}

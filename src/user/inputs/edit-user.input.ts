import { Field, InputType } from '@nestjs/graphql';
import { MaxLength, MinLength } from 'class-validator';

@InputType()
export class EditUserDataInput {
  @Field({ nullable: true })
  @MinLength(10)
  password?: string;

  @Field({ nullable: true })
  @MaxLength(255)
  bio?: string;

  changePasswordToken?: string;
}

@InputType()
export class EditUserInput {
  @Field()
  data: EditUserDataInput;
}

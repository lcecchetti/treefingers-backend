import { Field, InputType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@InputType()
export class RecoverPasswordInput {
  @Field()
  @IsEmail()
  readonly email: string;
}

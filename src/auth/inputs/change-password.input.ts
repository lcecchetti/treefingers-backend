import { Field, InputType } from '@nestjs/graphql';
import { MinLength } from 'class-validator';

@InputType()
export class ChangePasswordInput {
  @Field()
  readonly user: string;

  @Field()
  readonly token: string;

  @Field()
  @MinLength(10)
  readonly password: string;
}

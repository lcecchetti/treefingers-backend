import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class JoinInput {
  @Field(() => ID)
  forest: number;

  member: number;
}

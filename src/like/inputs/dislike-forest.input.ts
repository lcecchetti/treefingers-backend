import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class DislikeForestInput {
  @Field(() => ID)
  forest: string;
}

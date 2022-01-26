import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class LikeForestInput {
  @Field(() => ID)
  forest: string;
}

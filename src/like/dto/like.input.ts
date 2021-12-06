import { InputType, ArgsType, Field } from '@nestjs/graphql';
import { LikeFilterInput } from './like-filter.input';

@InputType()
@ArgsType()
export class LikeInput {
  @Field(() => LikeFilterInput, { nullable: true })
  filter?: LikeFilterInput = new LikeFilterInput();
}

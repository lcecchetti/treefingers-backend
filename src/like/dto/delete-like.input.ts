import { Field, InputType } from '@nestjs/graphql';
import { LikeFilterInput } from './like-filter.input';

@InputType()
export class DeleteLikeInput {
  @Field()
  filter: LikeFilterInput;
}

import { Field, InputType } from '@nestjs/graphql';
import {
  FilterIdInput,
  FilterInput,
  FilterIntInput,
} from '../../query/inputs/filter.input';
@InputType()
export class FilterCommentInput extends FilterInput {
  @Field(() => [FilterCommentInput], { nullable: true })
  and?: FilterCommentInput[];

  @Field(() => [FilterCommentInput], { nullable: true })
  or?: FilterCommentInput[];

  @Field(() => FilterIdInput, { nullable: true })
  story?: FilterIdInput;

  @Field(() => FilterIdInput, { nullable: true })
  forest?: FilterIdInput;

  @Field(() => FilterIntInput, { nullable: true })
  likesCount?: FilterIntInput;
}

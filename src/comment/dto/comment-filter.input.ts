import { Field, InputType } from '@nestjs/graphql';
import { FilterIdInput, FilterInput } from 'src/common/filter/dto/filter.input';

@InputType()
export class CommentFilterInput extends FilterInput {
  @Field(() => [CommentFilterInput], { nullable: true })
  and?: [CommentFilterInput];

  @Field(() => [CommentFilterInput], { nullable: true })
  or?: [CommentFilterInput];

  @Field(() => FilterIdInput, { nullable: true })
  story?: FilterIdInput;

  @Field(() => FilterIdInput, { nullable: true })
  user?: FilterIdInput;
}

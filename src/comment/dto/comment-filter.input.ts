import { Field, InputType } from '@nestjs/graphql';
import { FilterIdInput, FilterInput } from 'src/common/filter/dto/filter.input';

@InputType()
export class CommentFilterInput extends FilterInput {
  @Field(() => FilterIdInput, { nullable: true })
  readonly story?: FilterIdInput;

  @Field(() => FilterIdInput, { nullable: true })
  readonly user?: FilterIdInput;
}

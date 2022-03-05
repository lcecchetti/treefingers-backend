import { Field, InputType } from '@nestjs/graphql';
import { FilterIdInput, FilterInput } from 'src/filter/inputs/filter.input';

@InputType()
export class FilterLikeInput extends FilterInput {
  @Field(() => FilterIdInput, { nullable: true })
  readonly user?: FilterIdInput;

  @Field(() => FilterIdInput, { nullable: true })
  readonly story?: FilterIdInput;

  @Field(() => FilterIdInput, { nullable: true })
  readonly comment?: FilterIdInput;

  @Field(() => FilterIdInput, { nullable: true })
  readonly author?: FilterIdInput;

  @Field(() => FilterIdInput, { nullable: true })
  readonly forest?: FilterIdInput;
}

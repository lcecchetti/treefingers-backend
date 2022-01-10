import { Field, InputType } from '@nestjs/graphql';
import { FilterIdInput, FilterInput } from 'src/query/dto/filter.input';

@InputType()
export class StoryFilterInput extends FilterInput {
  @Field(() => [StoryFilterInput], { nullable: true })
  and?: [StoryFilterInput];

  @Field(() => [StoryFilterInput], { nullable: true })
  or?: [StoryFilterInput];

  @Field(() => FilterIdInput, { nullable: true })
  author?: FilterIdInput;

  @Field(() => FilterIdInput, { nullable: true })
  parent?: FilterIdInput;

  @Field(() => FilterIdInput, { nullable: true })
  tags?: FilterIdInput;

  @Field(() => FilterIdInput, { nullable: true })
  root?: FilterIdInput;
}

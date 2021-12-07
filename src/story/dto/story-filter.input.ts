import { Field, ID, InputType } from '@nestjs/graphql';
import { FilterInput } from 'src/pagination/dto/filter.input';

@InputType()
export class StoryFilterInput extends FilterInput {
  @Field(() => ID, { nullable: true })
  author?: string;

  @Field(() => ID, { nullable: true })
  parent?: string;

  @Field(() => ID, { nullable: true })
  tag?: string;
}

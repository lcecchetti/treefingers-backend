import { Field, ID, InputType } from '@nestjs/graphql';
import { FilterInput } from 'src/common/filter/dto/filter.input';

@InputType()
export class StoryFilterInput extends FilterInput {
  @Field(() => ID, { nullable: true })
  author?: any;

  @Field(() => ID, { nullable: true })
  parent?: any;

  @Field(() => ID, { nullable: true })
  tag?: any;
}

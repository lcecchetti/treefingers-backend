import { Field, InputType } from '@nestjs/graphql';
import {
  FilterFieldIdInput,
  FilterInput,
} from 'src/common/filter/dto/filter.input';

@InputType()
export class StoryFilterInput extends FilterInput {
  @Field(() => FilterFieldIdInput, { nullable: true })
  author?: FilterFieldIdInput;

  @Field(() => FilterFieldIdInput, { nullable: true })
  parent?: FilterFieldIdInput;

  @Field(() => FilterFieldIdInput, { nullable: true })
  tag?: FilterFieldIdInput;
}

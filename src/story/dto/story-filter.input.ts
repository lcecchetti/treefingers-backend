import { Field, InputType } from '@nestjs/graphql';
import { FilterInput } from 'src/pagination/dto/filter.input';

@InputType()
export class StoryFilterInput extends FilterInput {
  @Field({ nullable: true })
  author?: string;
}

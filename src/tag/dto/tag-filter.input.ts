import { Field, ID, InputType } from '@nestjs/graphql';
import { FilterInput } from 'src/pagination/dto/filter.input';

@InputType()
export class TagFilterInput extends FilterInput {
  @Field(() => ID, { nullable: true })
  readonly slug?: string;
}

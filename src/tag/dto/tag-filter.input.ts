import { Field, InputType } from '@nestjs/graphql';
import { FilterInput } from 'src/common/filter/dto/filter.input';

@InputType()
export class TagFilterInput extends FilterInput {
  @Field({ nullable: true })
  readonly slug?: string;
}

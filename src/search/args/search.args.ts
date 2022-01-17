import { ArgsType, Field } from '@nestjs/graphql';
import { PaginationInput } from 'src/query/inputs/pagination.input';

@ArgsType()
export class SearchArgs {
  @Field(() => PaginationInput, { nullable: true })
  pagination?: PaginationInput = new PaginationInput();

  @Field()
  query: string;
}

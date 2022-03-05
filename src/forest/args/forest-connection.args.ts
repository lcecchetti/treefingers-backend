import { ArgsType, Field } from '@nestjs/graphql';
import { ConnectionArgs } from 'src/query/args/connection.args';
import { SortInput } from 'src/query/inputs/sort.input';
import { FilterForestInput } from '../inputs/filter-forest.input';

@ArgsType()
export class ForestConnectionArgs extends ConnectionArgs {
  @Field(() => FilterForestInput, { nullable: true })
  readonly filter?: FilterForestInput = new FilterForestInput();

  @Field(() => SortInput, { nullable: true })
  readonly sort?: SortInput = new SortInput();
}

import { ArgsType, Field } from '@nestjs/graphql';
import { ConnectionArgs } from 'src/pagination/args/connection.args';
import { FilterForestInput } from '../inputs/filter-forest.input';
import { SortForestInput } from '../inputs/sort-forest.input';

@ArgsType()
export class ForestConnectionArgs extends ConnectionArgs {
  @Field(() => FilterForestInput, { nullable: true })
  filter?: FilterForestInput = new FilterForestInput();

  @Field(() => SortForestInput, { nullable: true })
  sort?: SortForestInput = new SortForestInput();
}

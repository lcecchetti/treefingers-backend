import { ArgsType, Field } from '@nestjs/graphql';
import { ConnectionArgs } from 'src/query/args/connection.args';

@ArgsType()
export class SearchArgs extends ConnectionArgs {
  @Field()
  readonly query: string;
}

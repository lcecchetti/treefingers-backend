import { ArgsType, Field } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { FilterInput } from '../inputs/filter.input';
import { PaginationInput } from '../inputs/pagination.input';
import { SortInput } from '../inputs/sort.input';
@ArgsType()
export class ConnectionArgs {
  @Field({ nullable: true })
  readonly filter?: FilterInput = new FilterInput();

  @Field({ nullable: true })
  readonly sort?: SortInput = new SortInput();

  @Field({ nullable: true })
  @ValidateNested()
  @Type(() => PaginationInput)
  readonly pagination?: PaginationInput = new PaginationInput();
}

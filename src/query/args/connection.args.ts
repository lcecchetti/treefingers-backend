import { ArgsType, Field } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { FilterInput } from 'src/query/dto/filter.input';
import { PaginationInput } from '../dto/pagination.input';
import { SortInput } from '../dto/sort.input';

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

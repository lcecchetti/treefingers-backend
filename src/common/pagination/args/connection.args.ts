import { ArgsType, Field } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { FilterInput } from 'src/common/filter/dto/filter.input';
import { SortInput } from 'src/common/sort/dto/sort.input';
import { PaginationInput } from '../dto/pagination.input';

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

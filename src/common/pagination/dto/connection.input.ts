import { Field, InputType, ArgsType } from '@nestjs/graphql';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationInput } from './pagination.input';
import { FilterInput } from 'src/common/filter/dto/filter.input';
import { SortInput } from 'src/common/sort/dto/sort.input';

@InputType()
@ArgsType()
export class ConnectionInput {
  @Field({ nullable: true })
  readonly filter?: FilterInput = new FilterInput();

  @Field({ nullable: true })
  readonly sort?: SortInput = new SortInput();

  @Field({ nullable: true })
  @ValidateNested()
  @Type(() => PaginationInput)
  readonly pagination?: PaginationInput = new PaginationInput();
}

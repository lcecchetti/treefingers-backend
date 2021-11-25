import { Field, InputType, ArgsType } from '@nestjs/graphql';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationInput } from './pagination.input';

@InputType()
@ArgsType()
export class ConnectionInput {
  @Field({ nullable: true })
  readonly filter?: string;

  @Field({ nullable: true })
  readonly sort?: string;

  @Field({ nullable: true })
  @ValidateNested()
  @Type(() => PaginationInput)
  readonly pagination?: PaginationInput = new PaginationInput();
}

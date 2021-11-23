import { Field, InputType, ArgsType } from '@nestjs/graphql';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationInput } from './pagination.input';

@InputType()
@ArgsType()
export class ConnectionInput {
  @Field({ nullable: true })
  filter?: string;

  @Field({ nullable: true })
  sort?: string;

  @Field({ nullable: true })
  @ValidateNested()
  @Type(() => PaginationInput)
  pagination?: PaginationInput = new PaginationInput();
}

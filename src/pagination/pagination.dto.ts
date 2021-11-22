import { Field, Int, ArgsType, InputType } from '@nestjs/graphql';
import { Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class PaginationInput {
  @Field({ nullable: true })
  cursor?: string;

  @Field(() => Int, { nullable: true })
  @Min(1)
  currentPage?: number = 1;

  @Field(() => Int, { nullable: true })
  @Min(1)
  pageSize?: number = 10;
}

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

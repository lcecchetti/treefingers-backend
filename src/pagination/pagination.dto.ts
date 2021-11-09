import { Field, Int, ArgsType, InputType } from '@nestjs/graphql';
import { IsPositive, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class PaginationInput {
  @Field({ nullable: true })
  cursor?: string;

  @Field((type) => Int, { nullable: true })
  @Min(1)
  currentPage?: number;

  @Field((type) => Int, { nullable: true })
  @IsPositive()
  pageSize?: number;
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
  pagination?: PaginationInput;
}

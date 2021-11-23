import { Field, Int, InputType } from '@nestjs/graphql';
import { Min } from 'class-validator';

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

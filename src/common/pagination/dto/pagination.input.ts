import { Field, Int, InputType } from '@nestjs/graphql';
import { Min } from 'class-validator';

@InputType()
export class PaginationInput {
  @Field({ nullable: true })
  readonly cursor?: string;

  @Field(() => Int, { nullable: true })
  @Min(1)
  readonly currentPage?: number = 1;

  @Field(() => Int, { nullable: true })
  @Min(1)
  readonly pageSize?: number = 10;
}

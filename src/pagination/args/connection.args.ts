import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsOptional, Max, Min } from 'class-validator';

@ArgsType()
export class ConnectionArgs {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @Min(1)
  @Max(20)
  first?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @Min(1)
  @Max(20)
  last?: number;

  @Field({ nullable: true })
  before?: string;

  @Field({ nullable: true })
  after?: string;
}

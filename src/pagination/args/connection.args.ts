import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsOptional, Min } from 'class-validator';

@ArgsType()
export class ConnectionArgs {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @Min(1)
  readonly first?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @Min(1)
  readonly last?: number;

  @Field({ nullable: true })
  readonly before?: string;

  @Field({ nullable: true })
  readonly after?: string;
}

import { Field, ID, InputType, Int } from '@nestjs/graphql';

@InputType()
export class FilterStringInput {
  @Field(() => String, { nullable: true })
  eq?: string;

  @Field(() => [String], { nullable: true })
  in?: [string];
}

@InputType()
export class FilterIdInput {
  @Field(() => ID, { nullable: true })
  eq?: string;

  @Field(() => [ID], { nullable: true })
  in?: [string];

  @Field(() => ID, { nullable: true })
  gt?: string;

  @Field(() => ID, { nullable: true })
  lt?: string;
}

@InputType()
export class FilterIntInput {
  @Field(() => Int, { nullable: true })
  eq?: number;

  @Field(() => [Number], { nullable: true })
  in?: [number];
}

@InputType()
export class FilterInput {
  @Field(() => [FilterInput], { nullable: true })
  and?: [FilterInput];

  @Field(() => [FilterInput], { nullable: true })
  or?: [FilterInput];

  @Field(() => FilterIdInput, { nullable: true })
  _id?: FilterIdInput;
}

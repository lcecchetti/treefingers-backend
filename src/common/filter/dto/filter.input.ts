import { Field, ID, InputType, Int } from '@nestjs/graphql';

@InputType()
export class FilterFieldInput {
  @Field(() => [FilterFieldInput], { nullable: true })
  and?: [FilterFieldInput];

  @Field(() => [FilterFieldInput], { nullable: true })
  or?: [FilterFieldInput];
}

@InputType()
export class FilterFieldStringInput extends FilterFieldInput {
  @Field(() => String, { nullable: true })
  eq?: string;

  @Field(() => [String], { nullable: true })
  in?: [string];
}

@InputType()
export class FilterFieldIdInput extends FilterFieldInput {
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
export class FilterFieldIntInput extends FilterFieldInput {
  @Field(() => Int, { nullable: true })
  eq?: number;

  @Field(() => [Number], { nullable: true })
  in?: [number];
}

@InputType()
export class FilterInput {
  @Field(() => FilterFieldIdInput, { nullable: true })
  _id?: FilterFieldIdInput;
}

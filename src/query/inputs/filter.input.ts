import { Field, ID, InputType, Int } from '@nestjs/graphql';

@InputType()
export class FilterStringInput {
  @Field(() => String, { nullable: true })
  eq?: string;

  @Field(() => String, { nullable: true })
  ne?: string;

  @Field(() => [String], { nullable: true })
  in?: string[];

  @Field(() => [String], { nullable: true })
  nin?: string[];
}

@InputType()
export class FilterIdInput {
  @Field(() => ID, { nullable: true })
  eq?: string;

  @Field(() => ID, { nullable: true })
  ne?: string;

  @Field(() => [ID], { nullable: true })
  in?: string[];

  @Field(() => [ID], { nullable: true })
  nin?: string[];
}

@InputType()
export class FilterIntInput {
  @Field(() => Int, { nullable: true })
  eq?: number;

  @Field(() => Int, { nullable: true })
  ne?: number;

  @Field(() => [Int], { nullable: true })
  in?: number[];

  @Field(() => [Int], { nullable: true })
  nin?: number[];
}

@InputType()
export class FilterInput {
  @Field(() => FilterIdInput, { nullable: true })
  _id?: FilterIdInput;
}

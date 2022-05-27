import { Field, InputType, Int } from '@nestjs/graphql';
import { EncodedID } from 'src/common/scalars/encoded-id.scalar';

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

  @Field(() => String, { nullable: true })
  like?: string;

  @Field(() => String, { nullable: true })
  ilike?: string;
}

@InputType()
export class FilterBooleanInput {
  @Field(() => Boolean, { nullable: true })
  eq?: boolean;

  @Field(() => Boolean, { nullable: true })
  ne?: boolean;
}

@InputType()
export class FilterIdInput {
  @Field(() => EncodedID, { nullable: true })
  eq?: number;

  @Field(() => EncodedID, { nullable: true })
  ne?: number;

  @Field(() => [EncodedID], { nullable: true })
  in?: number[];

  @Field(() => [EncodedID], { nullable: true })
  nin?: number[];
}

@InputType()
export class FilterIntInput {
  @Field(() => Int, { nullable: true })
  eq?: number;

  @Field(() => Int, { nullable: true })
  ne?: number;

  @Field(() => Int, { nullable: true })
  gt?: number;

  @Field(() => Int, { nullable: true })
  lt?: number;

  @Field(() => Int, { nullable: true })
  gte?: number;

  @Field(() => Int, { nullable: true })
  lte?: number;

  @Field(() => [Int], { nullable: true })
  in?: number[];

  @Field(() => [Int], { nullable: true })
  nin?: number[];
}

@InputType()
export class FilterInput {
  @Field(() => FilterIdInput, { nullable: true })
  id?: FilterIdInput;
}

import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class CreateLikeDataInput {
  @Field(() => ID, { nullable: true })
  readonly story?: string;

  @Field(() => ID, { nullable: true })
  readonly comment?: string;

  @Field(() => ID, { nullable: true })
  readonly author?: string;

  user?: string;
}
@InputType()
export class CreateLikeInput {
  @Field()
  data: CreateLikeDataInput;
}

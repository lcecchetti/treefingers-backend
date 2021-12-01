import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class FilterInput {
  @Field(() => ID, { nullable: true })
  _id?: any;
}

import { Field, ID, InputType } from '@nestjs/graphql';
import { FilterInput } from 'src/common/filter/dto/filter.input';

@InputType()
export class CommentFilterInput extends FilterInput {
  @Field(() => ID, { nullable: true })
  readonly story?: any;

  @Field(() => ID, { nullable: true })
  readonly user?: any;
}

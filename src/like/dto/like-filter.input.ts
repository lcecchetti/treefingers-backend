import { Field, ID, InputType } from '@nestjs/graphql';
import { FilterInput } from 'src/pagination/dto/filter.input';

@InputType()
export class LikeFilterInput extends FilterInput {
  @Field(() => ID, { nullable: true })
  readonly story?: string;

  @Field(() => ID, { nullable: true })
  readonly user?: string;

  @Field(() => ID, { nullable: true })
  readonly comment?: string;

  @Field(() => ID, { nullable: true })
  readonly author?: string;
}

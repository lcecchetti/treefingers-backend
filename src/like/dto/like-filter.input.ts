import { Field, InputType } from '@nestjs/graphql';
import {
  FilterFieldIdInput,
  FilterInput,
} from 'src/common/filter/dto/filter.input';

@InputType()
export class LikeFilterInput extends FilterInput {
  @Field(() => FilterFieldIdInput, { nullable: true })
  readonly story?: FilterFieldIdInput;

  @Field(() => FilterFieldIdInput, { nullable: true })
  readonly user?: FilterFieldIdInput;

  @Field(() => FilterFieldIdInput, { nullable: true })
  readonly comment?: FilterFieldIdInput;

  @Field(() => FilterFieldIdInput, { nullable: true })
  readonly author?: FilterFieldIdInput;
}

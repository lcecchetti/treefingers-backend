import { Field, InputType } from '@nestjs/graphql';
import { FilterIdInput, FilterInput } from 'src/query/inputs/filter.input';
import { LikeableEntityType } from '../enums/likeable-entity-type.enum';

@InputType()
class FilterLikeableEntityTypeInput extends FilterInput {
  @Field(() => LikeableEntityType, { nullable: true })
  eq: LikeableEntityType;
}

@InputType()
export class FilterLikeInput extends FilterInput {
  @Field(() => FilterIdInput, { nullable: true })
  entity?: FilterIdInput;

  @Field(() => FilterLikeableEntityTypeInput, { nullable: true })
  entityType?: FilterLikeableEntityTypeInput;

  @Field(() => FilterIdInput, { nullable: true })
  user?: FilterIdInput;

  or?: FilterLikeInput[];
}

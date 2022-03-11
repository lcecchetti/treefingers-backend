import { Field, InputType } from '@nestjs/graphql';
import { FilterIdInput, FilterInput } from 'src/filter/inputs/filter.input';
import { LikeableEntityType } from '../enums/likeable-entity-type.enum';

@InputType()
export class FilterLikeInput extends FilterInput {
  @Field(() => FilterIdInput, { nullable: true })
  readonly entity?: FilterIdInput;

  @Field(() => LikeableEntityType, { nullable: true })
  readonly entityType?: LikeableEntityType;

  @Field(() => FilterIdInput, { nullable: true })
  readonly user?: FilterIdInput;
}

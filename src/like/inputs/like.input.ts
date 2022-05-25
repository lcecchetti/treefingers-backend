import { Field, ID, InputType } from '@nestjs/graphql';
import { LikeableEntityType } from '../enums/likeable-entity-type.enum';

@InputType()
export class LikeInput {
  @Field(() => ID)
  entity: number;

  @Field(() => LikeableEntityType)
  entityType: LikeableEntityType;

  user: number;
}

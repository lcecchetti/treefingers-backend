import { Field, ID, InputType } from '@nestjs/graphql';
import { LikeableEntityType } from '../enums/likeable-entity-type.enum';

@InputType()
export class LikeInput {
  @Field(() => ID)
  entityId: number;

  @Field(() => LikeableEntityType)
  entityType: LikeableEntityType;

  userId: number;
}

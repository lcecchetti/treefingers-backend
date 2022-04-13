import { Field, ID, InputType } from '@nestjs/graphql';
import { LikeableEntityType } from '../enums/likeable-entity-type.enum';

@InputType()
export class LikeInput {
  @Field(() => ID)
  entity: string;

  @Field(() => LikeableEntityType)
  entityType: LikeableEntityType;

  user: string;
}

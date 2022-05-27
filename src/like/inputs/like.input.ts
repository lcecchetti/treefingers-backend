import { Field, InputType } from '@nestjs/graphql';
import { EncodedID } from 'src/common/scalars/encoded-id.scalar';
import { LikeableEntityType } from '../enums/likeable-entity-type.enum';

@InputType()
export class LikeInput {
  @Field(() => EncodedID)
  entity: number;

  @Field(() => LikeableEntityType)
  entityType: LikeableEntityType;

  user: number;
}

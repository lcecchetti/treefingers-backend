import { Field, InputType } from '@nestjs/graphql';
import { HashedIDScalar } from 'src/common/scalars/hashed-id.scalar';
import { LikeableEntityType } from '../enums/likeable-entity-type.enum';

@InputType()
export class LikeInput {
  @Field(() => HashedIDScalar)
  entity: number;

  @Field(() => LikeableEntityType)
  entityType: LikeableEntityType;

  user: number;
}

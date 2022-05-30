import { Field, InputType } from '@nestjs/graphql';
import { EncodedID } from 'src/common/scalars/encoded-id.scalar';

@InputType()
export class LikeInput {
  @Field(() => EncodedID, { nullable: true })
  story?: number;

  @Field(() => EncodedID, { nullable: true })
  comment?: number;

  user: number;
}

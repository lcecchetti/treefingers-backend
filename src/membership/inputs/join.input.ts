import { Field, InputType } from '@nestjs/graphql';
import { EncodedID } from 'src/common/scalars/encoded-id.scalar';

@InputType()
export class JoinInput {
  @Field(() => EncodedID)
  forest: number;

  member: number;
}

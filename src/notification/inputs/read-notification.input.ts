import { Field, InputType } from '@nestjs/graphql';
import { EncodedID } from '../../common/scalars/encoded-id.scalar';

@InputType()
export class ReadNotificationInput {
  @Field(() => EncodedID)
  id: number;
}

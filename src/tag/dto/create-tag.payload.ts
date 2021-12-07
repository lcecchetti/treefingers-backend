import { Field, ObjectType } from '@nestjs/graphql';
import { Tag } from '../tag.entity';

@ObjectType()
export class CreateTagPayload {
  @Field(() => Tag)
  readonly tag: Tag;
}

import { Field, ObjectType } from '@nestjs/graphql';
import { Forest } from '../forest.entity';

@ObjectType()
export class CreateForestPayload {
  @Field(() => Forest)
  forest: Forest;
}

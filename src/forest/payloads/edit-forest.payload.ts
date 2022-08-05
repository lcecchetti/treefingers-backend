import { Field, ObjectType } from '@nestjs/graphql';
import { Forest } from '../forest.entity';

@ObjectType()
export class EditForestPayload {
  @Field(() => Forest)
  forest: Forest;
}

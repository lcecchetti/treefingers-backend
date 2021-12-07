import { InputType, ArgsType, Field } from '@nestjs/graphql';
import { TagFilterInput } from './tag-filter.input';

@InputType()
@ArgsType()
export class TagInput {
  @Field(() => TagFilterInput, { nullable: true })
  filter?: TagFilterInput = new TagFilterInput();
}

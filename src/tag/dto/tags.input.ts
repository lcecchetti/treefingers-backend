import { InputType, ArgsType, Field } from '@nestjs/graphql';
import { ConnectionInput } from 'src/common/pagination/dto/connection.input';
import { TagFilterInput } from 'src/tag/dto/tag-filter.input';

@InputType()
@ArgsType()
export class TagsInput extends ConnectionInput {
  @Field(() => TagFilterInput, { nullable: true })
  filter?: TagFilterInput = new TagFilterInput();
}

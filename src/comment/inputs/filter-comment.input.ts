import { Field, InputType } from '@nestjs/graphql';
import { FilterIdInput, FilterInput } from 'src/query/inputs/filter.input';
import { CommentableEntityType } from '../enums/commentable-entity-type.enum';

@InputType()
class FilterCommentableEntityTypeInput extends FilterInput {
  @Field(() => CommentableEntityType, { nullable: true })
  eq: CommentableEntityType;
}

@InputType()
export class FilterCommentInput extends FilterInput {
  @Field(() => [FilterCommentInput], { nullable: true })
  and?: FilterCommentInput[];

  @Field(() => [FilterCommentInput], { nullable: true })
  or?: FilterCommentInput[];

  @Field(() => FilterIdInput, { nullable: true })
  entityId?: FilterIdInput;

  @Field(() => FilterCommentableEntityTypeInput, { nullable: true })
  entityType?: FilterCommentableEntityTypeInput;
}

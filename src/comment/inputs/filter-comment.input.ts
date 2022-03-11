import { Field, InputType } from '@nestjs/graphql';
import { FilterIdInput, FilterInput } from 'src/filter/inputs/filter.input';
import { CommentableEntityType } from '../enums/commentable-entity-type.enum';

@InputType()
export class FilterCommentInput extends FilterInput {
  @Field(() => [FilterCommentInput], { nullable: true })
  and?: FilterCommentInput[];

  @Field(() => [FilterCommentInput], { nullable: true })
  or?: FilterCommentInput[];

  @Field(() => FilterIdInput, { nullable: true })
  story?: FilterIdInput;

  @Field(() => FilterIdInput, { nullable: true })
  entity?: FilterIdInput;

  @Field(() => CommentableEntityType, { nullable: true })
  entityType?: CommentableEntityType;
}

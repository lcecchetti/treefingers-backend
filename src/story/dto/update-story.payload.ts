import { Field, ObjectType } from '@nestjs/graphql';
import { UpdateResultPayload } from 'src/query/args/update-result.payload';
import { Story } from '../story.entity';

@ObjectType()
export class UpdateStoryPayload {
  @Field(() => Story, { nullable: true })
  story?: Story;

  @Field(() => UpdateResultPayload, { nullable: true })
  result?: UpdateResultPayload;
}

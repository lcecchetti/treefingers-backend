import { Field, ObjectType } from '@nestjs/graphql';
import { StoryConnection } from 'src/story/dto/story-connection.dto';
import { TagConnection } from 'src/tag/dto/tag-connection.dto';
import { UserConnection } from 'src/user/dto/user-connection.dto';

@ObjectType()
export class SearchResults {
  @Field(() => StoryConnection)
  stories: StoryConnection;

  @Field(() => UserConnection)
  authors: UserConnection;

  @Field(() => TagConnection)
  tags: TagConnection;
}

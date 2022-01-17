import { Field, ObjectType } from '@nestjs/graphql';
import { StoryConnection } from 'src/story/dto/story-connection.dto';
import { TagConnection } from 'src/tag/dto/tag-connection.dto';
import { UserConnection } from 'src/user/dto/user-connection.dto';

@ObjectType()
export class SearchResults {
  @Field(() => StoryConnection, { nullable: true })
  stories: StoryConnection;

  @Field(() => UserConnection, { nullable: true })
  users: UserConnection;

  @Field(() => TagConnection, { nullable: true })
  tags: TagConnection;
}

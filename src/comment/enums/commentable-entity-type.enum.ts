import { registerEnumType } from '@nestjs/graphql';

export enum CommentableEntityType {
  ForestComment = 'ForestComment',
  StoryComment = 'StoryComment',
}

registerEnumType(CommentableEntityType, { name: 'CommentableEntityType' });

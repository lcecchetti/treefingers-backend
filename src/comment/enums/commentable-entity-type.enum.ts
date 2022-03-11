import { registerEnumType } from '@nestjs/graphql';

export enum CommentableEntityType {
  Forest = 'Forest',
  Story = 'Story',
}

registerEnumType(CommentableEntityType, { name: 'CommentableEntityType' });

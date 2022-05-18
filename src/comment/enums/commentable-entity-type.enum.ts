import { registerEnumType } from '@nestjs/graphql';

export enum CommentableEntityType {
  Forest = 'Forest',
}

registerEnumType(CommentableEntityType, { name: 'CommentableEntityType' });

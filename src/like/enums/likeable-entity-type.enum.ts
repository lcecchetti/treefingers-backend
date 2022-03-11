import { registerEnumType } from '@nestjs/graphql';

export enum LikeableEntityType {
  Comment = 'Comment',
  Story = 'Story',
}

registerEnumType(LikeableEntityType, { name: 'LikeableEntityType' });

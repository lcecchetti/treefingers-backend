import { registerEnumType } from '@nestjs/graphql';

export enum LikeableEntityType {
  Comment = 'Comment',
}

registerEnumType(LikeableEntityType, { name: 'LikeableEntityType' });

import * as DataLoader from 'dataloader';
import { GqlExecutionContext } from '@nestjs/graphql';
import { DataloaderProvider } from '@tracworx/nestjs-dataloader';
import { CommentService } from '../comment.service';
import { Comment } from '../comment.entity';

@DataloaderProvider()
export class CommentDataloader {
  constructor(private readonly commentService: CommentService) {}

  createDataloader(ctx: GqlExecutionContext) {
    return new DataLoader<string, Comment>(async (_ids) =>
      this.commentService.findMany({ _id: { in: [..._ids] } }),
    );
  }
}

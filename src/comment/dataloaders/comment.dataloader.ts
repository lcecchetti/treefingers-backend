import DataLoader from 'dataloader';
import { DataloaderProvider } from '@tracworx/nestjs-dataloader';
import { CommentService } from '../comment.service';
import { Comment } from '../comment.entity';

@DataloaderProvider()
export class CommentDataloader {
  constructor(private readonly commentService: CommentService) {}

  createDataloader() {
    return new DataLoader<number, Comment>(async (ids) =>
      this.commentService.findMany({ id: { in: [...ids] } }),
    );
  }
}

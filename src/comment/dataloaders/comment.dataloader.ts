import DataLoader from 'dataloader';
import { DataloaderProvider } from '@tracworx/nestjs-dataloader';
import { CommentService } from '../comment.service';
import { Comment } from '../comment.entity';

@DataloaderProvider()
export class CommentDataloader {
  constructor(private readonly commentService: CommentService) {}

  createDataloader() {
    return new DataLoader<number, Comment>(async (ids) => {
      const comments = await this.commentService.findMany({
        id: { in: [...ids] },
      });
      return ids.map((id) => comments.find((comment) => comment.id === id));
    });
  }
}

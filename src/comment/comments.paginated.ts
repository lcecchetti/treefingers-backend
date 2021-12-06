import { Paginated } from 'src/pagination/pagination.entity';
import { ObjectType } from '@nestjs/graphql';
import { Comment } from './comment.entity';

@ObjectType()
export class CommentsPaginated extends Paginated(Comment) {}

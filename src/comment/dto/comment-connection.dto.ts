import { ObjectType } from '@nestjs/graphql';
import { Paginated } from 'src/query/dto/pagination.dto';
import { Comment } from '../comment.entity';

@ObjectType()
export class CommentConnection extends Paginated(Comment) {}

import { Paginated } from 'src/common/pagination/dto/pagination.dto';
import { ObjectType } from '@nestjs/graphql';
import { Comment } from '../comment.entity';

@ObjectType()
export class CommentsPaginated extends Paginated(Comment) {}

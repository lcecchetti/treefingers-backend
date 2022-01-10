import { ObjectType } from '@nestjs/graphql';
import { Paginated } from 'src/query/dto/pagination.dto';
import { User } from '../user.entity';

@ObjectType()
export class UserConnection extends Paginated(User) {}

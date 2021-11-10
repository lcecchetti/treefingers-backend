import { Paginated } from 'src/pagination/pagination.entity';
import { ObjectType } from '@nestjs/graphql';
import { User } from './user.entity';

@ObjectType()
export class UserConnection extends Paginated(User) {}

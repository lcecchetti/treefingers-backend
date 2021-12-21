import { Paginated } from 'src/common/pagination/dto/pagination.dto';
import { ObjectType } from '@nestjs/graphql';
import { User } from '../user.entity';

@ObjectType()
export class UserConnection extends Paginated(User) {}

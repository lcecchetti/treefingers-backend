import { Resolver, Query, Args } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserConnection } from './user.connection';
import { ConnectionInput } from '../pagination/pagination.dto';
@Resolver()
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => UserConnection)
  async users(@Args() args: ConnectionInput): Promise<UserConnection> {
    return this.userService.paginate(args);
  }
}

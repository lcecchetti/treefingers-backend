import { Resolver, Query, Args } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserConnection } from './user.connection';
import { ConnectionInput } from '../pagination/pagination.dto';
import { User } from './user.entity';

@Resolver()
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => UserConnection)
  async users(@Args() args: ConnectionInput): Promise<UserConnection> {
    return this.userService.paginate(args);
  }

  @Query(() => User)
  async userByEmail(@Args('email') email: string): Promise<User> {
    return this.userService.findOne({ email });
  }
}

import { Resolver, Query, Args } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserConnection } from './user.connection';
import { User } from './user.entity';
import { ConnectionInput } from 'src/pagination/dto/connection.input';
import { UserByEmailInput } from './dto/user-by-email.input';

@Resolver()
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => UserConnection)
  async users(
    @Args('input', { nullable: true }) input: ConnectionInput,
  ): Promise<UserConnection> {
    return this.userService.paginate(input);
  }

  @Query(() => User)
  async userByEmail(@Args('input') { email }: UserByEmailInput): Promise<User> {
    return this.userService.findOneByEmail(email);
  }
}

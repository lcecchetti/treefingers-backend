import { Resolver, Query, Args } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserConnection } from './user.connection';
import { User } from './user.entity';
import { UserInput } from './dto/user.input';
import { UsersInput } from './dto/users.input';

@Resolver()
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => UserConnection)
  async users(
    @Args('input', { nullable: true }) input: UsersInput,
  ): Promise<UserConnection> {
    return this.userService.paginate(input);
  }

  @Query(() => User, { nullable: true })
  async user(
    @Args('input', { nullable: true }) { filter }: UserInput = new UserInput(),
  ): Promise<User> {
    return this.userService.findOne(filter);
  }
}

import {
  Resolver,
  Query,
  Args,
  ResolveField,
  Parent,
  Mutation,
} from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './user.entity';
import { UserConnectionArgs } from './args/user-connection.args';
import { GetCurrentUser } from '../auth/decorators/get-current-user.decorator';
import { StringService } from 'src/utils/services/string.service';
import { CurrentUser } from 'src/auth/dto/current-user.dto';
import { UserConnection } from './dto/user-connection.dto';
import { FilterUserInput } from './inputs/filter-user.input';
import { IsAuthenticatedGuard } from 'src/auth/guards/is-authenticated.guard';
import { UseGuards } from '@nestjs/common';
import { EditUserPayload } from './payloads/edit-user.payload';
import { EditUserInput } from './inputs/edit-user.input';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private stringService: StringService,
    private userService: UserService,
  ) {}

  @Query(() => UserConnection)
  async users(
    @Args()
    args: UserConnectionArgs = new UserConnectionArgs(),
  ): Promise<UserConnection> {
    return this.userService.paginate(args);
  }

  @Query(() => User, { nullable: true })
  async user(
    @Args('filter', { nullable: true })
    filter: FilterUserInput = new FilterUserInput(),
  ): Promise<User> {
    return this.userService.findOne(filter);
  }

  @Query(() => User, { nullable: true })
  async currentUser(
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<CurrentUser | null> {
    if (!currentUser) {
      return null;
    }
    return this.userService.findById(currentUser.id);
  }

  @UseGuards(IsAuthenticatedGuard)
  @Mutation(() => EditUserPayload)
  async editUser(
    @Args('input') { data }: EditUserInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<EditUserPayload> {
    return {
      user: await this.userService.edit(currentUser.id, data),
    };
  }

  @ResolveField(() => String)
  async excerpt(@Parent() user: User): Promise<string> {
    return this.stringService.createExcerpt(user.bio);
  }
}

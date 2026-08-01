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
import { StringService } from '../common/services/string.service';
import { CurrentUser } from '../auth/dto/current-user.dto';
import { UserConnection } from './dto/user-connection.dto';
import { FilterUserInput } from './inputs/filter-user.input';
import { IsAuthenticatedGuard } from '../auth/guards/is-authenticated.guard';
import { UseGuards } from '@nestjs/common';
import { EditUserPayload } from './payloads/edit-user.payload';
import { EditUserInput } from './inputs/edit-user.input';
import { Followership } from '../followership/followership.entity';
import { FollowershipDataloader } from '../followership/dataloaders/followership.dataloader';
import { Loader } from '@tracworx/nestjs-dataloader';
import { connectionComplexity } from '../graphql/connection-complexity';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private stringService: StringService,
    private userService: UserService,
  ) {}

  @Query(() => UserConnection, { complexity: connectionComplexity })
  async users(
    @Args()
    args: UserConnectionArgs = new UserConnectionArgs(),
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<UserConnection> {
    return this.userService.paginate(args, currentUser);
  }

  @Query(() => User, { nullable: true })
  async user(
    @Args('filter', { nullable: true })
    filter: FilterUserInput = new FilterUserInput(),
  ): Promise<User | null> {
    // public lookup: hide inactive/banned accounts unless asked for explicitly
    return this.userService.findOne({
      ...filter,
      isActive: filter.isActive ?? true,
      isBanned: filter.isBanned ?? false,
    });
  }

  @Query(() => CurrentUser, { nullable: true })
  async currentUser(
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<CurrentUser | null> {
    if (!currentUser) {
      return null;
    }

    return currentUser;
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

  @ResolveField(() => Followership, { nullable: true })
  async currentUserFollowershipAsFollower(
    @GetCurrentUser() currentUser: CurrentUser,
    @Parent() user: User,
    @Loader(FollowershipDataloader) followershipDataloader,
  ): Promise<Followership | null> {
    if (!currentUser) {
      return null;
    }

    return followershipDataloader.load({
      followed: user.id,
      follower: currentUser.id,
    });
  }
}

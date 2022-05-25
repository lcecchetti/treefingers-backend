import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Loader } from '@tracworx/nestjs-dataloader';
import { GetCurrentUser } from 'src/auth/decorators/get-current-user.decorator';
import { CurrentUser } from 'src/auth/dto/current-user.dto';
import { IsAuthenticatedGuard } from 'src/auth/guards/is-authenticated.guard';
import { ForestDataloader } from 'src/forest/dataloaders/forest.dataloader';
import { Forest } from 'src/forest/forest.entity';
import { UserDataloader } from 'src/user/dataloaders/user.dataloader';
import { User } from 'src/user/user.entity';
import { JoinInput } from './inputs/join.input';
import { LeaveInput } from './inputs/leave.input';
import { Membership } from './membership.entity';
import { MembershipService } from './membership.service';
import { JoinPayload } from './payloads/join.payload';
import { LeavePayload } from './payloads/leave.payload';

@Resolver(() => Membership)
export class MembershipResolver {
  constructor(private membershipService: MembershipService) {}

  @Mutation(() => JoinPayload)
  @UseGuards(IsAuthenticatedGuard)
  async join(
    @Args('input') input: JoinInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<JoinPayload> {
    return {
      membership: await this.membershipService.join({
        ...input,
        member: currentUser.id,
      }),
    };
  }

  @Mutation(() => LeavePayload)
  @UseGuards(IsAuthenticatedGuard)
  async leave(
    @Args('input') input: LeaveInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<LeavePayload> {
    return {
      membership: await this.membershipService.leave({
        ...input,
        member: currentUser.id,
      }),
    };
  }

  @ResolveField()
  async member(
    @Parent() membership: Membership,
    @Loader(UserDataloader) userDataloader,
  ): Promise<User> {
    return userDataloader.load(membership.member.id);
  }

  @ResolveField()
  async forest(
    @Parent() membership: Membership,
    @Loader(ForestDataloader) forestDataloader,
  ): Promise<Forest> {
    return forestDataloader.load(membership.forest.id);
  }
}

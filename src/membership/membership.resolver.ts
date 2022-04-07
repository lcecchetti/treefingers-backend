import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { GetCurrentUser } from 'src/auth/decorators/get-current-user.decorator';
import { CurrentUser } from 'src/auth/dto/current-user.dto';
import { IsAuthenticatedGuard } from 'src/auth/guards/is-authenticated.guard';
import { Forest } from 'src/forest/forest.entity';
import { ForestService } from 'src/forest/forest.service';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { JoinInput } from './inputs/join.input';
import { LeaveInput } from './inputs/leave.input';
import { Membership } from './membership.entity';
import { MembershipService } from './membership.service';
import { JoinPayload } from './payloads/join.payload';
import { LeavePayload } from './payloads/leave.payload';

@Resolver(() => Membership)
export class MembershipResolver {
  constructor(
    private membershipService: MembershipService,
    private forestService: ForestService,
    private userService: UserService,
  ) {}

  @Mutation(() => JoinPayload)
  @UseGuards(IsAuthenticatedGuard)
  async join(
    @Args('input') input: JoinInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<JoinPayload> {
    return {
      membership: await this.membershipService.join(input, currentUser._id),
    };
  }

  @Mutation(() => LeavePayload)
  @UseGuards(IsAuthenticatedGuard)
  async leave(
    @Args('input') input: LeaveInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<LeavePayload> {
    return {
      membership: await this.membershipService.leave(input, currentUser._id),
    };
  }

  @ResolveField()
  async member(@Parent() membership: Membership): Promise<User> {
    return this.userService.findById(membership.member._id);
  }

  @ResolveField()
  async forest(@Parent() membership: Membership): Promise<Forest> {
    return this.forestService.findById(membership.forest._id);
  }
}

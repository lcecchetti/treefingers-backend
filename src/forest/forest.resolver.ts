import {
  Resolver,
  Query,
  Args,
  ResolveField,
  Parent,
  Mutation,
} from '@nestjs/graphql';
import { ForestService } from './forest.service';
import { Forest } from './forest.entity';
import { ForestConnectionArgs } from './args/forest-connection.args';
import { CreateForestPayload } from './payloads/create-forest.payload';
import { CreateForestInput } from './inputs/create-forest.input';
import { FilterForestInput } from './inputs/filter-forest.input';
import { User } from '../user/user.entity';
import { StringService } from '../common/services/string.service';
import { ForestConnection } from './dto/forest-connection.dto';
import { GetCurrentUser } from '../auth/decorators/get-current-user.decorator';
import { CurrentUser } from '../auth/dto/current-user.dto';
import { UseGuards } from '@nestjs/common';
import { IsAuthenticatedGuard } from '../auth/guards/is-authenticated.guard';
import { Loader } from '@tracworx/nestjs-dataloader';
import { ForestDataloader } from './dataloaders/forest.dataloader';
import { Membership } from '../membership/membership.entity';
import { MembershipDataloader } from '../membership/dataloaders/membership.dataloader';
import { EditForestPayload } from './payloads/edit-forest.payload';
import { EditForestInput } from './inputs/edit-forest.input';

@Resolver(() => Forest)
export class ForestResolver {
  constructor(
    private stringService: StringService,
    private forestService: ForestService,
  ) {}

  @Query(() => ForestConnection)
  async forests(
    @Args()
    args: ForestConnectionArgs = new ForestConnectionArgs(),
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<ForestConnection> {
    return this.forestService.paginate(args, currentUser);
  }

  @Query(() => Forest, { nullable: true })
  async forest(
    @Args('filter', { nullable: true })
    filter: FilterForestInput,
  ): Promise<Forest> {
    return this.forestService.findOne(filter);
  }

  @Mutation(() => CreateForestPayload)
  @UseGuards(IsAuthenticatedGuard)
  async createForest(
    @Args('input') { data }: CreateForestInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<CreateForestPayload> {
    return {
      forest: await this.forestService.create({
        ...data,
        founder: currentUser.id,
      }),
    };
  }

  @UseGuards(IsAuthenticatedGuard)
  @Mutation(() => EditForestPayload)
  async editForest(
    @Args('input') { id, data }: EditForestInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<EditForestPayload> {
    return {
      forest: await this.forestService.edit(id, data, currentUser),
    };
  }

  @ResolveField(() => Boolean, { defaultValue: false })
  async isEditable(
    @GetCurrentUser() currentUser: CurrentUser,
    @Parent() forest: Forest,
  ): Promise<boolean> {
    return this.forestService.isEditable(forest, currentUser);
  }

  @ResolveField(() => String)
  async excerpt(@Parent() forest: Forest): Promise<string> {
    return this.stringService.createExcerpt(forest.about);
  }

  @ResolveField(() => User)
  async founder(
    @Parent() forest: Forest,
    @Loader(ForestDataloader) forestDataloader,
  ): Promise<User> {
    return forestDataloader.load(forest.founder.id);
  }

  @ResolveField(() => Membership, { nullable: true })
  async currentUserMembership(
    @GetCurrentUser() currentUser: CurrentUser,
    @Parent() forest: Forest,
    @Loader(MembershipDataloader) membershipDataloader,
  ): Promise<Membership | null> {
    if (!currentUser) {
      return null;
    }

    return membershipDataloader.load({
      forest: forest.id,
      member: currentUser.id,
    });
  }
}

import * as DataLoader from 'dataloader';
import { UserService } from '../user.service';
import { User } from '../user.entity';
import { GqlExecutionContext } from '@nestjs/graphql';
import { DataloaderProvider } from '@tracworx/nestjs-dataloader';

@DataloaderProvider()
export class UserDataloader {
  constructor(private readonly userService: UserService) {}

  createDataloader(ctx: GqlExecutionContext) {
    return new DataLoader<string, User>(async (_ids) =>
      this.userService.findMany({ _id: { in: [..._ids] } }),
    );
  }
}

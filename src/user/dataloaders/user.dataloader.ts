import * as DataLoader from 'dataloader';
import { UserService } from '../user.service';
import { User } from '../user.entity';
import { DataloaderProvider } from '@tracworx/nestjs-dataloader';

@DataloaderProvider()
export class UserDataloader {
  constructor(private readonly userService: UserService) {}

  createDataloader() {
    return new DataLoader<string, User>(async (_ids) =>
      this.userService.findMany({ _id: { in: [..._ids] } }),
    );
  }
}

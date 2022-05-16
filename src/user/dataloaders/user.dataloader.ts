import * as DataLoader from 'dataloader';
import { UserService } from '../user.service';
import { User } from '../user.entity';
import { DataloaderProvider } from '@tracworx/nestjs-dataloader';

@DataloaderProvider()
export class UserDataloader {
  constructor(private readonly userService: UserService) {}

  createDataloader() {
    return new DataLoader<number, User>(async (ids) =>
      this.userService.findMany({ id: { in: [...ids] } }),
    );
  }
}

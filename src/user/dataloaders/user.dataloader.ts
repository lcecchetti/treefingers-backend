import DataLoader from 'dataloader';
import { UserService } from '../user.service';
import { User } from '../user.entity';
import { DataloaderProvider } from '@tracworx/nestjs-dataloader';

@DataloaderProvider()
export class UserDataloader {
  constructor(private readonly userService: UserService) {}

  createDataloader() {
    return new DataLoader<number, User>(async (ids) => {
      const users = await this.userService.findMany({ id: { in: [...ids] } });
      return ids.map((id) => users.find((user) => user.id === id));
    });
  }
}

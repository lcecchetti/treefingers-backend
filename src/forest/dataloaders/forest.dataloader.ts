import DataLoader from 'dataloader';
import { DataloaderProvider } from '@tracworx/nestjs-dataloader';
import { Forest } from '../forest.entity';
import { ForestService } from '../forest.service';

@DataloaderProvider()
export class ForestDataloader {
  constructor(private readonly forestService: ForestService) {}

  createDataloader() {
    return new DataLoader<number, Forest>(async (ids) =>
      this.forestService.findMany({ id: { in: [...ids] } }),
    );
  }
}

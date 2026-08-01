import DataLoader from 'dataloader';
import { DataloaderProvider } from '@tracworx/nestjs-dataloader';
import { Forest } from '../forest.entity';
import { ForestService } from '../forest.service';

@DataloaderProvider()
export class ForestDataloader {
  constructor(private readonly forestService: ForestService) {}

  createDataloader() {
    return new DataLoader<number, Forest | undefined>(async (ids) => {
      const forests = await this.forestService.findMany({
        id: { in: [...ids] },
      });
      return ids.map((id) => forests.find((forest) => forest.id === id));
    });
  }
}

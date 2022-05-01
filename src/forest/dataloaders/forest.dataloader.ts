import * as DataLoader from 'dataloader';
import { GqlExecutionContext } from '@nestjs/graphql';
import { DataloaderProvider } from '@tracworx/nestjs-dataloader';
import { Forest } from '../forest.entity';
import { ForestService } from '../forest.service';

@DataloaderProvider()
export class ForestDataloader {
  constructor(private readonly forestService: ForestService) {}

  createDataloader(ctx: GqlExecutionContext) {
    return new DataLoader<string, Forest>(async (_ids) =>
      this.forestService.findMany({ _id: { in: [..._ids] } }),
    );
  }
}

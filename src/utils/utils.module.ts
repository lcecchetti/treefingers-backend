import { Global, Module } from '@nestjs/common';
import { StringService } from './services/string.service';

@Global()
@Module({
  providers: [StringService],
  exports: [StringService],
})
export class UtilsModule {}

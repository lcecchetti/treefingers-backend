import { Global, Module } from '@nestjs/common';
import { EncodedID } from './scalars/encoded-id.scalar';
import { StringService } from './services/string.service';

@Global()
@Module({
  providers: [StringService, EncodedID],
  exports: [StringService],
})
export class CommonModule {}

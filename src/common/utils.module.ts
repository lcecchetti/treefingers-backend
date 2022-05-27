import { Global, Module } from '@nestjs/common';
import { HashedIDScalar } from './scalars/hashed-id.scalar';
import { StringService } from './services/string.service';

@Global()
@Module({
  providers: [StringService, HashedIDScalar],
  exports: [StringService],
})
export class CommonModule {}

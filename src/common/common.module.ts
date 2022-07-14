import { Global, Module } from '@nestjs/common';
import { EncodedID } from './scalars/encoded-id.scalar';
import { StringService } from './services/string.service';
import { UrlService } from './services/url.service';

@Global()
@Module({
  providers: [StringService, UrlService, EncodedID],
  exports: [StringService, UrlService],
})
export class CommonModule {}

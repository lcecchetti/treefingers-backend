import { Scalar, CustomScalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';
import { UrlService } from '../services/url.service';

@Scalar('HashedID')
export class EncodedID implements CustomScalar<string, number> {
  description = 'Hashed ID custom scalar type';

  constructor(private urlService: UrlService) {}

  parseValue(value: string): number {
    return this.urlService.decodeId(value);
  }

  serialize(value: number): string {
    return this.urlService.encodeId(value);
  }

  parseLiteral(ast: ValueNode): number | null {
    if (ast.kind === Kind.STRING) {
      return this.parseValue(ast.value);
    }
    return null;
  }
}

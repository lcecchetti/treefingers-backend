import { Scalar, CustomScalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';
import Hashids from 'hashids';

@Scalar('HashedID')
export class HashedIDScalar implements CustomScalar<string, number> {
  description = 'Hashed ID custom scalar type';
  hashids = new Hashids('Treefingers', 10);

  parseValue(value: string): number {
    return value && (this.hashids.decode(value)[0] as number);
  }

  serialize(value: number): string {
    return this.hashids.encode(value);
  }

  parseLiteral(ast: ValueNode): number | null {
    if (ast.kind === Kind.STRING) {
      return this.parseValue(ast.value);
    }
    return null;
  }
}

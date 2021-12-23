import { createParamDecorator } from '@nestjs/common';
import { gqlFilterToMongo } from '../filter.helper';

export const GqlFilterToMongo = createParamDecorator((data: unknown) => {
  return gqlFilterToMongo(data);
});

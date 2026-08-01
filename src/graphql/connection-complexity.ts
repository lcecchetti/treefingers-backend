import { ComplexityEstimatorArgs } from '@nestjs/graphql';

// weights a paginated connection field by the page size actually requested,
// so nested connections (e.g. stories -> comments -> likes) multiply their
// complexity instead of each only counting once regardless of `first`/`last`
export const connectionComplexity = ({
  args,
  childComplexity,
}: ComplexityEstimatorArgs): number => {
  const pageSize = args.first ?? args.last ?? 10;
  return pageSize * childComplexity;
};

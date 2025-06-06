import { ResolverConfig } from '../constructs/graphql-construct';

export const resolvers: ResolverConfig[] = [
  {
    typeName: 'Query',
    fieldName: 'getUserProfile',
    fileName: 'getUserProfile.js',
  },
];

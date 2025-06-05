import { schemaPath } from '@vitality-ai/graphql';
import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { BaseDynamoDBConstruct } from '../constructs/base-dynamodb-construct';
import { GraphqlApiConstruct } from '../constructs/graphql-construct';
import {
  registerDynamoResolvers,
  ResolverConfig,
} from '../constructs/resolvers-registrar';
import { AuthenticationConstruct } from '../constructs/authentication-construct';

export interface AppStackProps extends StackProps {
  readonly stageName: string;
}

const resolvers: ResolverConfig[] = [
  {
    typeName: 'Query',
    fieldName: 'getUserProfile',
    fileName: 'getUserProfile.js',
  },
];

export class AppStack extends Stack {
  constructor(scope: Construct, id: string, props: AppStackProps) {
    super(scope, id, props);

    const authentication = new AuthenticationConstruct(this, 'Authentication', {
      stageName: props.stageName,
    });

    const graphqlApi = new GraphqlApiConstruct(this, 'VitalityAIGraphqlApi', {
      name: 'vitalityai-graphql-api',
      stageName: props.stageName,
      schemaPath,
      userPool: authentication.userPool,
    });

    const table = new BaseDynamoDBConstruct(this, 'VitalityAISingleTable', {
      stageName: props.stageName,
    });

    registerDynamoResolvers(graphqlApi, table, resolvers);
  }
}

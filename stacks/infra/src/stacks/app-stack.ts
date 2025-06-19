import { schemaPath } from '@vitality-ai/graphql';
import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { BaseDynamoDBConstruct } from '../constructs/base-dynamodb-construct';
import { GraphqlApiConstruct } from '../constructs/graphql-construct';
import { Stage } from '../utils/enums';
import { resolvers } from '../utils/constants';
import { CommonLambdaFunction } from '../constructs/common-lambda-function-construct';
import path from 'path';

export interface AppStackProps extends StackProps {
  readonly stageName: Stage;
}

export class AppStack extends Stack {
  constructor(scope: Construct, id: string, props: AppStackProps) {
    super(scope, id, props);

    const authorizer = new CommonLambdaFunction(this, 'ApiAuthorizerFunction', {
      functionName: 'ApiAuthorizerFunction',
      functionPath: path.join(
        __dirname,
        '..',
        'lambda',
        'auth',
        'api-authorizer.ts',
      ),
      environmentVariables: {
        CLERK_API_KEY: process.env.CLERK_API_KEY ?? '',
      },
    });

    const table = new BaseDynamoDBConstruct(this, 'VitalityAISingleTable', {
      stageName: props.stageName,
    });

    const graphqlApi = new GraphqlApiConstruct(this, 'VitalityAIGraphqlApi', {
      stageName: props.stageName,
      name: 'vitalityai-graphql-api',
      schemaPath,
      authorizerFunction: authorizer.function,
    });
    graphqlApi.registerDynamoDbResolvers(table, resolvers);
  }
}

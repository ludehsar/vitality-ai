import { schemaPath } from '@vitality-ai/graphql';
import { Stack, StackProps } from 'aws-cdk-lib';
import {
  AuthorizationType,
  Code,
  FunctionRuntime,
  SchemaFile,
} from 'aws-cdk-lib/aws-appsync';
import { AttributeType } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import path from 'path';
import { BaseDynamoDBConstruct } from '../constructs/base-dynamodb-construct';
import { GraphqlApiConstruct } from '../constructs/graphql-construct';

export interface AppStackProps extends StackProps {
  readonly stageName: string;
}

export class AppStack extends Stack {
  constructor(scope: Construct, id: string, props: AppStackProps) {
    super(scope, id, props);

    const graphqlApi = new GraphqlApiConstruct(this, 'VitalityAIGraphqlApi', {
      name: 'vitalityai-graphql-api',
      stageName: props.stageName,
      definition: {
        schema: SchemaFile.fromAsset(schemaPath),
      },
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: AuthorizationType.API_KEY,
        },
      },
    });

    const table = new BaseDynamoDBConstruct(this, 'VitalityAISingleTable', {
      stageName: props.stageName,
      partitionKey: {
        name: 'PK',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'SK',
        type: AttributeType.STRING,
      },
      globalSecondaryIndexes: [
        {
          indexName: 'GSI1',
          partitionKey: {
            name: 'GSI1PK',
            type: AttributeType.STRING,
          },
          sortKey: {
            name: 'GSI1SK',
            type: AttributeType.STRING,
          },
        },
        {
          indexName: 'GSI2',
          partitionKey: {
            name: 'GSI2PK',
            type: AttributeType.STRING,
          },
          sortKey: {
            name: 'GSI2SK',
            type: AttributeType.STRING,
          },
        },
      ],
    });

    const ddbDataSource = graphqlApi.addDynamoDbDataSource(
      'VitalityAISingleTableDDBDataSource',
      table
    );

    ddbDataSource.createResolver('getUserProfile', {
      typeName: 'Query',
      fieldName: 'getUserProfile',
      runtime: FunctionRuntime.JS_1_0_0,
      code: Code.fromAsset(
        path.join(
          __dirname,
          '..',
          'graphql',
          'resolvers-compiled',
          'getUserProfile.js'
        )
      ),
    });
  }
}

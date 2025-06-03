import { Construct } from 'constructs';
import { Stack, StackProps } from 'aws-cdk-lib';
import { BaseDynamoDBConstruct } from '../constructs/base-dynamodb-construct';
import { GraphqlApiConstruct } from '../constructs/graphql-construct';
import { AuthorizationType, Code, FunctionRuntime, SchemaFile } from 'aws-cdk-lib/aws-appsync';
import { schemaPath } from '@vitality-ai/graphql'
import path from 'path';

export interface ApiStackProps extends StackProps {
  readonly stageName: string;
  readonly table: BaseDynamoDBConstruct;
}

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const graphqlApi = new GraphqlApiConstruct(this, 'VitalityAIGraphqlApi', {
      name: 'vitalityai-graphql-api',
      stageName: props.stageName,
      schema: SchemaFile.fromAsset(schemaPath),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: AuthorizationType.API_KEY,
        }
      }
    });

    const ddbDataSource = graphqlApi.addDynamoDbDataSource('VitalityAISingleTableDDBDataSource', props.table);

    ddbDataSource.createResolver('getUserProfile', {
      typeName: "Query",
      fieldName: "getUserProfile",
      runtime: FunctionRuntime.JS_1_0_0,
      code: Code.fromInline(path.join(__dirname, '..', 'graphql', 'resolvers-compiled', 'users', 'getUserProfile.js'))
    });
  }
}

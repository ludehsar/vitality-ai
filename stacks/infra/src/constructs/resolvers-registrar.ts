import { GraphqlApi } from 'aws-cdk-lib/aws-appsync';
import { TableV2 } from 'aws-cdk-lib/aws-dynamodb';
import { Code, FunctionRuntime } from 'aws-cdk-lib/aws-appsync';
import path from 'path';

export interface ResolverConfig {
  readonly typeName: string;
  readonly fieldName: string;
  readonly fileName: string;
}

export function registerDynamoResolvers(
  api: GraphqlApi,
  table: TableV2,
  resolvers: ResolverConfig[]
) {
  const dataSource = api.addDynamoDbDataSource(
    'SingleTableDDBDataSource',
    table
  );
  resolvers.forEach(({ typeName, fieldName, fileName }) => {
    dataSource.createResolver(fieldName, {
      typeName,
      fieldName,
      runtime: FunctionRuntime.JS_1_0_0,
      code: Code.fromAsset(
        path.join(__dirname, '..', 'graphql', 'resolvers-compiled', fileName)
      ),
    });
  });
}

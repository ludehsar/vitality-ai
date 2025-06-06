import { CfnOutput } from 'aws-cdk-lib';
import {
  AuthorizationType,
  Code,
  FieldLogLevel,
  FunctionRuntime,
  GraphqlApi,
  GraphqlApiProps,
  IntrospectionConfig,
  SchemaFile,
} from 'aws-cdk-lib/aws-appsync';
import { UserPool } from 'aws-cdk-lib/aws-cognito';
import { TableV2 } from 'aws-cdk-lib/aws-dynamodb';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';
import path from 'path';
import { Stage } from '../utils/enums';

export interface GraphqlApiConstructProps extends GraphqlApiProps {
  readonly stageName: Stage;
  readonly schemaPath: string;
  readonly userPool: UserPool;
}

export interface ResolverConfig {
  readonly typeName: string;
  readonly fieldName: string;
  readonly fileName: string;
}

export class GraphqlApiConstruct extends GraphqlApi {
  constructor(
    scope: Construct,
    id: string,
    { stageName, schemaPath, userPool, ...props }: GraphqlApiConstructProps
  ) {
    super(scope, id, {
      logConfig: {
        retention:
          stageName === Stage.PROD
            ? RetentionDays.FIVE_YEARS
            : RetentionDays.ONE_MONTH,
        fieldLogLevel:
          stageName === Stage.PROD ? FieldLogLevel.ERROR : FieldLogLevel.ALL,
      },
      environmentVariables: {
        LOG_LEVEL: stageName === Stage.PROD ? 'ERROR' : 'DEBUG',
      },
      queryDepthLimit: 10,
      introspectionConfig:
        stageName === Stage.PROD
          ? IntrospectionConfig.DISABLED
          : IntrospectionConfig.ENABLED,
      xrayEnabled: true,
      definition: {
        schema: SchemaFile.fromAsset(schemaPath),
      },
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: AuthorizationType.USER_POOL,
          userPoolConfig: {
            userPool,
          },
        },
      },
      ...props,
    });

    new CfnOutput(this, 'GraphqlApiId', {
      key: 'GraphqlApiId',
      value: this.apiId,
    });
  }

  public registerDynamoDbResolvers(
    ddbTable: TableV2,
    resolvers: ResolverConfig[]
  ) {
    const dataSource = this.addDynamoDbDataSource(
      'SingleTableDDBDataSource',
      ddbTable
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
}

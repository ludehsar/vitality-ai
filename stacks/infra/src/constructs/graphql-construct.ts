import {
  AuthorizationType,
  FieldLogLevel,
  GraphqlApi,
  GraphqlApiProps,
  IntrospectionConfig,
  SchemaFile,
} from 'aws-cdk-lib/aws-appsync';
import { UserPool } from 'aws-cdk-lib/aws-cognito';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';

export interface GraphqlApiConstructProps extends GraphqlApiProps {
  readonly stageName: string;
  readonly schemaPath: string;
  readonly userPool: UserPool;
}

export class GraphqlApiConstruct extends GraphqlApi {
  constructor(
    scope: Construct,
    id: string,
    {
      stageName = 'dev',
      schemaPath,
      userPool,
      ...props
    }: GraphqlApiConstructProps
  ) {
    super(scope, id, {
      logConfig: {
        retention:
          stageName === 'prod'
            ? RetentionDays.FIVE_YEARS
            : RetentionDays.ONE_MONTH,
        fieldLogLevel:
          stageName === 'prod' ? FieldLogLevel.ERROR : FieldLogLevel.ALL,
      },
      environmentVariables: {
        LOG_LEVEL: stageName === 'prod' ? 'ERROR' : 'DEBUG',
      },
      queryDepthLimit: 10,
      introspectionConfig:
        stageName === 'prod'
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
  }
}

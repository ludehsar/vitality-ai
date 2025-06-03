import { FieldLogLevel, GraphqlApi, GraphqlApiProps, IntrospectionConfig } from 'aws-cdk-lib/aws-appsync';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';

export interface GraphqlApiConstructProps extends GraphqlApiProps {
  stageName: string;
}

export class GraphqlApiConstruct extends GraphqlApi {
  constructor(scope: Construct, id: string, { stageName = 'dev', ...props }: GraphqlApiConstructProps) {
    super(scope, id, {
      logConfig: {
        retention: stageName === 'prod' ? RetentionDays.FIVE_YEARS : RetentionDays.ONE_MONTH,
        fieldLogLevel: stageName === 'prod' ? FieldLogLevel.ERROR : FieldLogLevel.ALL,
      },
      environmentVariables: {
        LOG_LEVEL: stageName === 'prod' ? 'ERROR' : 'DEBUG',
      },
      queryDepthLimit: 10,
      introspectionConfig: stageName === 'prod' ? IntrospectionConfig.DISABLED : IntrospectionConfig.ENABLED,
      xrayEnabled: true,
      ...props,
    });
  }
}
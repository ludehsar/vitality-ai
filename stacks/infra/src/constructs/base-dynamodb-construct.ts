import { RemovalPolicy } from 'aws-cdk-lib';
import { Billing, TablePropsV2, TableV2 } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export interface BaseDynamoDBConstructProps extends TablePropsV2 {
  stageName: string;
}

export class BaseDynamoDBConstruct extends TableV2 {
  constructor(scope: Construct, id: string, { stageName, ...props }: BaseDynamoDBConstructProps) {
    super(scope, id, {
      billing: Billing.onDemand(),
      removalPolicy: stageName === 'prod' ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY,
      deletionProtection: stageName === 'prod' ? true : false,
      ...props,
    });
  }
}
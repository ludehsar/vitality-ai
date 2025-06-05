import { RemovalPolicy } from 'aws-cdk-lib';
import {
  AttributeType,
  Billing,
  TablePropsV2,
  TableV2,
} from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export interface BaseDynamoDBConstructProps extends Partial<TablePropsV2> {
  readonly stageName: string;
}

export class BaseDynamoDBConstruct extends TableV2 {
  constructor(
    scope: Construct,
    id: string,
    { stageName, ...props }: BaseDynamoDBConstructProps
  ) {
    super(scope, id, {
      billing: Billing.onDemand(),
      removalPolicy:
        stageName === 'prod' ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY,
      deletionProtection: stageName === 'prod' ? true : false,
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
      ...props,
    });
  }
}

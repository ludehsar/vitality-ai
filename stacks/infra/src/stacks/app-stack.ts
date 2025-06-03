import { Construct } from 'constructs';
import { Stack, StackProps } from 'aws-cdk-lib';
import { BaseDynamoDBConstruct } from '../constructs/base-dynamodb-construct';
import { AttributeType } from 'aws-cdk-lib/aws-dynamodb';
import { ApiStack } from './api-stack';

export interface AppStackProps extends StackProps {
  readonly stageName: string;
}

export class AppStack extends Stack {
  constructor(scope: Construct, id: string, props: AppStackProps) {
    super(scope, id, props);

    const table = new BaseDynamoDBConstruct(this, 'VitalityAISingleTable', {
      stageName: props.stageName,
      partitionKey: {
        name: 'PK',
        type: AttributeType.STRING
      },
      sortKey: {
        name: 'SK',
        type: AttributeType.STRING
      },
      globalSecondaryIndexes:
        [
          {
            indexName: 'GSI1',
            partitionKey: {
              name: 'GSI1PK',
              type: AttributeType.STRING
            },
            sortKey: {
              name: 'GSI1SK',
              type: AttributeType.STRING
            }
          },
          {
            indexName: 'GSI2',
            partitionKey: {
              name: 'GSI2PK',
              type: AttributeType.STRING
            },
            sortKey: {
              name: 'GSI2SK',
              type: AttributeType.STRING
            }
          }
        ],
    });

    new ApiStack(this, 'ApiStack', {
      stageName: props.stageName,
      table,
    });
  }
}

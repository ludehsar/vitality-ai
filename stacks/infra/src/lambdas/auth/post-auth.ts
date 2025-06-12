import { PostConfirmationTriggerHandler } from 'aws-lambda';
import { logger } from '@vitality-ai/utils';
import { DynamoDB, PutItemCommandInput } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';

export const handler: PostConfirmationTriggerHandler = async (
  event,
  _context,
  callback
) => {
  logger.info(
    'Authentication successful -> Launching Post Confirmation Lambda Trigger'
  );

  try {
    const dbClient = new DynamoDB();
    const date = new Date();

    if (event.request.userAttributes.sub) {
      const params: PutItemCommandInput = {
        TableName: process.env.DYNAMODB_TABLE_NAME,
        Item: marshall({
          PK: `USER#${event.request.userAttributes.sub}`,
          SK: `USER#${event.request.userAttributes.sub}`,
          email: event.request.userAttributes.email,
          givenName: event.request.userAttributes.given_name,
          familyName: event.request.userAttributes.family_name,
          phoneNumber: event.request.userAttributes.phone_number,
          createdAt: date.toISOString(),
          updatedAt: date.toISOString(),
        }),
      };

      await dbClient.putItem(params);
    }

    callback(null, event);
  } catch (error) {
    logger.error(
      `Error in Post Authentication Lambda Trigger: ${JSON.stringify(error)}`
    );
    callback(error as Error, null);
  }
};

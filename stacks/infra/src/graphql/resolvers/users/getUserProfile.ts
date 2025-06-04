import { Context } from '@aws-appsync/utils';
import * as ddb from '@aws-appsync/utils/dynamodb';
import {
  GetUserProfileQueryVariables,
  UserProfile,
} from '@vitality-ai/graphql';

export function request(ctx: Context<GetUserProfileQueryVariables>) {
  return ddb.get({
    key: { PK: `USER#${ctx.args.id}`, SK: `USER#${ctx.args.id}` },
  });
}

export function response(ctx: Context) {
  return ctx.result as UserProfile;
}

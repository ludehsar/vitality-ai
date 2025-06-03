import { Context } from '@aws-appsync/utils'
import { GetUserProfileQueryVariables, UserProfile } from '@vitality-ai/graphql'
import * as ddb from '@aws-appsync/utils/dynamodb'

export function request(ctx: Context<GetUserProfileQueryVariables>) {
  return ddb.get({ key: { PK: `USER#${ctx.args.id}` } });
}

export function response(ctx: Context) {
  return ctx.result.items as UserProfile | null;
}

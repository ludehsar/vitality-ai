// src/graphql/resolvers/users/getUserProfile.ts
import * as ddb from "@aws-appsync/utils/dynamodb";
function request(ctx) {
  return ddb.get({ key: { PK: `USER#${ctx.args.id}` } });
}
function response(ctx) {
  return ctx.result.items;
}
export {
  request,
  response
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vcmVzb2x2ZXJzL3VzZXJzL2dldFVzZXJQcm9maWxlLnRzIl0sCiAgIm1hcHBpbmdzIjogIjtBQUVBLFlBQVksU0FBUztBQUVkLFNBQVMsUUFBUSxLQUE0QztBQUNsRSxTQUFXLFFBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxRQUFRLElBQUksS0FBSyxFQUFFLEdBQUcsRUFBRSxDQUFDO0FBQ3ZEO0FBRU8sU0FBUyxTQUFTLEtBQWM7QUFDckMsU0FBTyxJQUFJLE9BQU87QUFDcEI7IiwKICAibmFtZXMiOiBbXQp9Cg==

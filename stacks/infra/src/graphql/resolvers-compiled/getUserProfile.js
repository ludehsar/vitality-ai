// src/graphql/resolvers/users/getUserProfile.ts
import * as ddb from "@aws-appsync/utils/dynamodb";
function request(ctx) {
  return ddb.get({
    key: { PK: `USER#${ctx.args.id}`, SK: `USER#${ctx.args.id}` }
  });
}
function response(ctx) {
  return ctx.result;
}
export {
  request,
  response
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vcmVzb2x2ZXJzL3VzZXJzL2dldFVzZXJQcm9maWxlLnRzIl0sCiAgIm1hcHBpbmdzIjogIjtBQUNBLFlBQVksU0FBUztBQU1kLFNBQVMsUUFBUSxLQUE0QztBQUNsRSxTQUFXLFFBQUk7QUFBQSxJQUNiLEtBQUssRUFBRSxJQUFJLFFBQVEsSUFBSSxLQUFLLEVBQUUsSUFBSSxJQUFJLFFBQVEsSUFBSSxLQUFLLEVBQUUsR0FBRztBQUFBLEVBQzlELENBQUM7QUFDSDtBQUVPLFNBQVMsU0FBUyxLQUFjO0FBQ3JDLFNBQU8sSUFBSTtBQUNiOyIsCiAgIm5hbWVzIjogW10KfQo=

import { CfnOutput } from 'aws-cdk-lib';
import {
  AccountRecovery,
  Mfa,
  UserPool,
  UserPoolClient,
  VerificationEmailStyle,
} from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';
import { Stage } from '../utils/enums';
import { CommonLambdaFunction } from './common-lambda-function-construct';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import path from 'path';
import { TableV2 } from 'aws-cdk-lib/aws-dynamodb';

export interface AuthenticationConstructProps {
  readonly stageName: Stage;
  readonly ddbTable: TableV2;
}

export class AuthenticationConstruct extends Construct {
  public readonly userPool: UserPool;

  constructor(
    scope: Construct,
    id: string,
    props: AuthenticationConstructProps
  ) {
    super(scope, id);
    const postAuthenticationLambda = new CommonLambdaFunction(
      this,
      'VitalityAiPostAuthenticationLambda',
      {
        functionPath: path.join(
          __dirname,
          '..',
          'lambdas',
          'auth',
          'post-auth.ts'
        ),
        functionName: 'vitality-ai-post-auth-lambda',
        environmentVariables: {
          DYNAMODB_TABLE_NAME: props.ddbTable.tableName,
        },
      }
    );
    props.ddbTable.grantWriteData(postAuthenticationLambda.function);
    this.userPool = this.createUserPool(
      props.stageName,
      postAuthenticationLambda.function
    );
    this.createUserPoolClient();
  }

  private createUserPool(
    stageName: Stage,
    postAuthenticationLambdaFunction: NodejsFunction
  ) {
    const userPool = new UserPool(this, 'AuthenticationUserPool', {
      selfSignUpEnabled: true,
      accountRecovery: AccountRecovery.PHONE_AND_EMAIL,
      userVerification: {
        emailStyle: VerificationEmailStyle.CODE,
      },
      autoVerify: {
        email: true,
      },
      standardAttributes: {
        email: {
          required: true,
          mutable: true,
        },
      },
      deletionProtection: stageName === Stage.PROD ? true : false,
      deviceTracking: {
        challengeRequiredOnNewDevice: true,
        deviceOnlyRememberedOnUserPrompt: true,
      },
      lambdaTriggers: {
        postAuthentication: postAuthenticationLambdaFunction,
      },
      mfa: Mfa.OPTIONAL,
    });

    new CfnOutput(this, 'UserPoolId', {
      key: 'UserPoolId',
      value: userPool.userPoolId,
    });

    return userPool;
  }

  private createUserPoolClient() {
    const client = new UserPoolClient(this, 'AuthenticationUserPoolClient', {
      userPool: this.userPool,
      authFlows: {
        userPassword: true,
      },
    });

    new CfnOutput(this, 'UserPoolClientId', {
      key: 'UserPoolClientId',
      value: client.userPoolClientId,
    });

    return client;
  }
}

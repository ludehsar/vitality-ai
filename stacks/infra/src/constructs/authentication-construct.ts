import { CfnOutput } from 'aws-cdk-lib';
import {
  AccountRecovery,
  Mfa,
  UserPool,
  UserPoolClient,
  VerificationEmailStyle,
} from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';

export interface AuthenticationConstructProps {
  readonly stageName: string;
}

export class AuthenticationConstruct extends Construct {
  public readonly userPool: UserPool;
  public readonly userPoolClient: UserPoolClient;

  constructor(
    scope: Construct,
    id: string,
    props: AuthenticationConstructProps
  ) {
    super(scope, id);

    this.userPool = new UserPool(this, 'AuthenticationUserPool', {
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
      deletionProtection: props.stageName === 'prod' ? true : false,
      mfa: Mfa.OPTIONAL,
    });

    this.userPoolClient = new UserPoolClient(
      this,
      'AuthenticationUserPoolClient',
      {
        userPool: this.userPool,
        authFlows: {
          userPassword: true,
        },
      }
    );

    new CfnOutput(this, 'UserPoolId', {
      key: 'UserPoolId',
      value: this.userPool.userPoolId,
    });

    new CfnOutput(this, 'UserPoolClientId', {
      key: 'UserPoolClientId',
      value: this.userPoolClient.userPoolClientId,
    });
  }
}

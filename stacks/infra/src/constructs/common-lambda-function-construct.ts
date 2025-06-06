import { Duration, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';

export interface CommonLambdaFunctionProps extends StackProps {
  functionPath: string;
  functionName: string;
  environmentVariables?: Record<string, string>;
}

export class CommonLambdaFunction extends Construct {
  public function: NodejsFunction;

  constructor(scope: Construct, id: string, props: CommonLambdaFunctionProps) {
    super(scope, id);
    this.function = this.createLambdaFunction(
      props.functionName,
      props.functionPath,
      props.environmentVariables
    );
  }

  private createLambdaFunction(
    functionName: string,
    functionPath: string,
    environmentVariables?: Record<string, string>
  ): NodejsFunction {
    const myLambda = new NodejsFunction(this, functionName, {
      runtime: Runtime.NODEJS_22_X,
      entry: functionPath,
      handler: 'handler',
      timeout: Duration.seconds(20),
      bundling: {
        minify: true,
        externalModules: ['@aws-sdk/client-dynamodb', '@aws-sdk/util-dynamodb'],
      },
      environment: environmentVariables,
    });
    return myLambda;
  }
}

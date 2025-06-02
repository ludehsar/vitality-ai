import { App, Environment } from 'aws-cdk-lib';
import { AppStack } from './stacks/app-stack';

// for development, use account/region from cdk cli
const devEnv: Environment = {
  account: process.env['CDK_DEFAULT_ACCOUNT'],
  region: process.env['CDK_DEFAULT_REGION'],
};

const app = new App();
new AppStack(app, 'infra', {
  env: devEnv,
});

app.synth();

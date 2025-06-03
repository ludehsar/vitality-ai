import { App, Aspects, Environment } from 'aws-cdk-lib';
import { AppStack } from './stacks/app-stack';
import { AwsSolutionsChecks, HIPAASecurityChecks } from 'cdk-nag';

// for development, use account/region from cdk cli
const devEnv: Environment = {
  account: process.env['CDK_DEFAULT_ACCOUNT'],
  region: process.env['CDK_DEFAULT_REGION'],
};

const stageName = process.env['STAGE_NAME'];

if (!stageName) {
  throw new Error('STAGE_NAME is not defined');
}

const app = new App();
new AppStack(app, 'infra', {
  env: devEnv,
  stageName,
});
Aspects.of(app).add(new AwsSolutionsChecks());
Aspects.of(app).add(new HIPAASecurityChecks());

app.synth();

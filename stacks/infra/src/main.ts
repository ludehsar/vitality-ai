import { App, Environment } from 'aws-cdk-lib';
import { AppStack } from './stacks/app-stack';
import { Stage } from './utils/enums';

// for development, use account/region from cdk cli
const devEnv: Environment = {
  account: process.env['CDK_DEFAULT_ACCOUNT'],
  region: process.env['CDK_DEFAULT_REGION'],
};

const stageName = process.env['STAGE_NAME'];

if (!stageName) {
  throw new Error('STAGE_NAME is not defined');
}

function validateStageName(stage: string): asserts stage is Stage {
  if (!(Object.values(Stage) as string[]).includes(stage)) {
    throw new Error('STAGE_NAME is not valid');
  }
}

validateStageName(stageName);

const app = new App();
new AppStack(app, 'infra', {
  env: devEnv,
  stageName,
});

app.synth();

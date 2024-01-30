import { App } from 'aws-cdk-lib';

import {
  getAppStage,
  projectName,
  region,
} from '@lambdalith/cdk-configuration';

import { CoreStack } from './stack';

const app = new App();

const stage = getAppStage(app);

new CoreStack(app, `${projectName}-core-${stage}`, {
  env: { region },
});

import { Stack, StackProps } from 'aws-cdk-lib';
import { HttpApi } from 'aws-cdk-lib/aws-apigatewayv2';
import { Construct } from 'constructs';

import { getAppStage } from '@lambdalith/cdk-configuration';

import { ExpressLambda, TrpcLambda } from 'functions/config';

export class CoreStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const stage = getAppStage(this);

    const coreApi = new HttpApi(this, 'CoreApi', {
      // the stage of the API is the same as the stage of the stack
      description: `Core API - ${stage}`,
    });

    new ExpressLambda(this, 'ExpressProxy', { httpApi: coreApi });
    new TrpcLambda(this, 'TrpcProxy', { httpApi: coreApi });
  }
}

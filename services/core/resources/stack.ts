import { CfnOutput, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { HttpApi } from 'aws-cdk-lib/aws-apigatewayv2';
import { AttributeType, TableV2 } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

import { getAppStage } from '@lambdalith/cdk-configuration';

import {
  ExpressLambda,
  FastifyLambda,
  HonoLambda,
  TrpcLambda,
} from 'functions/config';

export class CoreStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const stage = getAppStage(this);

    const coreApi = new HttpApi(this, 'CoreApi', {
      // the stage of the API is the same as the stage of the stack
      description: `Core API - ${stage}`,
    });

    new TableV2(this, 'Table', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      sortKey: { name: 'sk', type: AttributeType.NUMBER },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    new ExpressLambda(this, 'ExpressProxy', { httpApi: coreApi });
    new TrpcLambda(this, 'TrpcProxy', { httpApi: coreApi });
    new FastifyLambda(this, 'FastifyProxy', { httpApi: coreApi });
    new HonoLambda(this, 'HonoProxy', { httpApi: coreApi });

    new CfnOutput(this, 'CoreApiUrl', { value: coreApi.apiEndpoint });
  }
}

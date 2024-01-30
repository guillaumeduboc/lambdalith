import { getCdkHandlerPath } from '@swarmion/serverless-helpers';
import { HttpApi } from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { Architecture, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

import { sharedLambdaEsbuildConfig } from '@lambdalith/cdk-configuration';

type ExpressProps = { httpApi: HttpApi };

export class ExpressLambda extends Construct {
  public expressFunction: NodejsFunction;

  constructor(scope: Construct, id: string, { httpApi }: ExpressProps) {
    super(scope, id);

    this.expressFunction = new NodejsFunction(this, 'Lambda', {
      entry: getCdkHandlerPath(__dirname),
      handler: 'main',
      runtime: Runtime.NODEJS_18_X,
      architecture: Architecture.ARM_64,
      awsSdkConnectionReuse: true,
      bundling: sharedLambdaEsbuildConfig,
    });

    httpApi.addRoutes({
      path: 'express/{proxy+}',
      integration: new HttpLambdaIntegration(
        'ExpressProxyIntegration',
        this.expressFunction,
      ),
    });
  }
}

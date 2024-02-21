import { getCdkHandlerPath } from '@swarmion/serverless-helpers';
import { HttpApi } from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { Architecture, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';

import { sharedLambdaEsbuildConfig } from '@lambdalith/cdk-configuration';

type HonoProps = { httpApi: HttpApi };

export class HonoLambda extends Construct {
  public honoFunction: NodejsFunction;

  constructor(scope: Construct, id: string, { httpApi }: HonoProps) {
    super(scope, id);

    this.honoFunction = new NodejsFunction(this, 'Lambda', {
      entry: getCdkHandlerPath(__dirname),
      handler: 'main',
      runtime: Runtime.NODEJS_18_X,
      architecture: Architecture.ARM_64,
      awsSdkConnectionReuse: true,
      bundling: sharedLambdaEsbuildConfig,
      logRetention: RetentionDays.ONE_WEEK,
    });

    httpApi.addRoutes({
      path: '/hono/{proxy+}',
      integration: new HttpLambdaIntegration(
        'HonoProxyIntegration',
        this.honoFunction,
      ),
    });
  }
}

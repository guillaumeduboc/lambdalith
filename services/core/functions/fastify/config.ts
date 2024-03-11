import { getCdkHandlerPath } from '@swarmion/serverless-helpers';
import { HttpApi } from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { TableV2 } from 'aws-cdk-lib/aws-dynamodb';
import { Architecture, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';

import { sharedLambdaEsbuildConfig } from '@lambdalith/cdk-configuration';

import { TABLE_NAME_ENV_VAR } from 'shared/constants';

type FastifyProps = { httpApi: HttpApi; table: TableV2 };

export class FastifyLambda extends Construct {
  public fastifyFunction: NodejsFunction;

  constructor(scope: Construct, id: string, { httpApi, table }: FastifyProps) {
    super(scope, id);

    this.fastifyFunction = new NodejsFunction(this, 'Lambda', {
      entry: getCdkHandlerPath(__dirname),
      handler: 'main',
      runtime: Runtime.NODEJS_18_X,
      architecture: Architecture.ARM_64,
      awsSdkConnectionReuse: true,
      bundling: sharedLambdaEsbuildConfig,
      logRetention: RetentionDays.ONE_WEEK,
      environment: {
        [TABLE_NAME_ENV_VAR]: table.tableName,
      },
    });

    httpApi.addRoutes({
      path: '/fastify/{proxy+}',
      integration: new HttpLambdaIntegration(
        'FastifyProxyIntegration',
        this.fastifyFunction,
      ),
    });

    table.grantReadWriteData(this.fastifyFunction);
  }
}

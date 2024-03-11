import {
  type GenericApiGatewayContract,
  getHandler,
} from '@swarmion/serverless-contracts';
import { GetApiGatewayHandlerOptions } from '@swarmion/serverless-contracts/contracts/apiGateway/features';
import type {
  BodyType,
  CustomRequestContextType,
  HeadersType,
  InternalSwarmionApiGatewayHandler,
  OutputType,
  PathParametersType,
  QueryStringParametersType,
} from '@swarmion/serverless-contracts/contracts/apiGateway/types';
import Ajv from 'ajv';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { match } from 'path-to-regexp';

type GetHandler<Contract extends GenericApiGatewayContract> =
  InternalSwarmionApiGatewayHandler<
    Contract['integrationType'],
    Contract['authorizerType'],
    PathParametersType<Contract>,
    QueryStringParametersType<Contract>,
    HeadersType<Contract>,
    CustomRequestContextType<Contract>,
    BodyType<Contract>,
    OutputType<Contract>
  >;
type Route<
  Contract extends GenericApiGatewayContract = GenericApiGatewayContract,
> = [Contract, APIGatewayProxyHandlerV2];

export class SwarmionRouter {
  private routes: Route[] = [];
  private ajv = new Ajv();

  constructor({ ajv }: { ajv?: Ajv } = {}) {
    if (ajv) {
      this.ajv = ajv;
    }
  }

  add<Contract extends GenericApiGatewayContract>(
    contract: Contract,
    options?: Omit<GetApiGatewayHandlerOptions, 'ajv'>,
  ): (handler: GetHandler<Contract>) => void {
    return (handler: GetHandler<Contract>): void => {
      this.routes.push([
        contract,
        // @ts-expect-error excessively deep type
        getHandler<Contract>(contract, { ...options, ajv: this.ajv })(handler),
      ]);
    };
  }

  match(
    method: string,
    path: string,
  ): [APIGatewayProxyHandlerV2, Record<string, string>] | null {
    for (const [contract, handler] of this.routes) {
      const routerMatch = matchContract(contract, method, path);
      if (routerMatch === false) {
        continue;
      }

      return [handler, routerMatch];
    }

    return null;
  }
}

export const handle = (
  router: SwarmionRouter,
  options?: { logger?: boolean },
): APIGatewayProxyHandlerV2<unknown> => {
  return async (event, context, callback) => {
    if (options?.logger === true) {
      console.log('event', event);
    }

    const matchedRoute = router.match(
      event.requestContext.http.method,
      event.rawPath,
    );

    if (matchedRoute === null) {
      return Promise.resolve({
        statusCode: 404,
        body: 'Not found',
      });
    }

    const [handler, params] = matchedRoute;
    event.pathParameters = params;

    return handler(event, context, callback);
  };
};

const matchContract = (
  contract: GenericApiGatewayContract,
  method: string,
  path: string,
): Record<string, string> | false => {
  if (method !== contract.method) {
    return false;
  }

  const urlMatch = match<Record<string, string>>(
    contract.path.replaceAll('{', ':').replaceAll('}', ''),
  )(path);

  if (urlMatch === false) {
    return false;
  }

  return urlMatch.params;
};

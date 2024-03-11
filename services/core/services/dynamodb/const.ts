import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { getEnvVariable } from '@swarmion/serverless-helpers';
import { EntityV2, number, schema, string, TableV2 } from 'dynamodb-toolbox';

import { TABLE_NAME_ENV_VAR } from 'shared/constants';

const dynamoDBClient = new DynamoDBClient({});
const documentClient = DynamoDBDocumentClient.from(dynamoDBClient);

export const table = new TableV2({
  documentClient,
  name: () => getEnvVariable(TABLE_NAME_ENV_VAR),
  partitionKey: { name: 'pk', type: 'string' },
  sortKey: { name: 'sk', type: 'number' },
});

export const pokemonEntity = new EntityV2({
  name: 'Pokemon',
  table,
  schema: schema({
    id: number().key().savedAs('sk'),
    pk: string().key().const('POKEMON'),
    name: string(),
    height: number(),
    weight: number(),
  }),
});

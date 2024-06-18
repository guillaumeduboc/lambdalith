export const pokemonSchema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    name: { type: 'string' },
    height: { type: 'number' },
    weight: { type: 'number' },
  },
  required: ['id', 'name', 'height', 'weight'],
  additionalProperties: false,
} as const;

export const pokemonListItemSchema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    name: { type: 'string' },
  },
  required: ['id', 'name'],
} as const;

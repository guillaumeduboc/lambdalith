import {
  DeleteItemCommand,
  GetItemCommand,
  PutItemCommand,
  QueryCommand,
} from 'dynamodb-toolbox';

import { pokemonEntity, table } from './const';

export interface PokemonInfo {
  id: number;
  name: string;
  height: number;
  weight: number;
}

export const getPokemonById = async (id: number): Promise<PokemonInfo> => {
  const { Item: pokemon } = await pokemonEntity
    .build(GetItemCommand)
    .key({ id })
    .options({ attributes: ['id', 'name', 'height', 'weight'] })
    .send();

  if (pokemon === undefined) {
    throw new Error(`Pokemon with id ${id} not found`);
  }

  return pokemon;
};

export type PokemonList = Pick<PokemonInfo, 'id' | 'name'>[];

export const getPokemonList = async (): Promise<PokemonList> => {
  const { Items: pokemonList } = await table
    .build(QueryCommand)
    .entities(pokemonEntity)
    .query({ partition: 'POKEMON' })
    .options({ attributes: ['id', 'name'] })
    .send();

  if (pokemonList === undefined) {
    throw new Error(`No pokemon found`);
  }

  return pokemonList;
};

export const createPokemon = async (
  pokemonInfo: PokemonInfo,
): Promise<void> => {
  await pokemonEntity
    .build(PutItemCommand)
    .item(pokemonInfo)
    .options({ condition: { attr: 'id', exists: false } })
    .send();
};

export const deletePokemon = async (id: number): Promise<void> => {
  await pokemonEntity.build(DeleteItemCommand).key({ id }).send();
};

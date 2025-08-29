// src/types/city.ts
import type { Entity, ListResponse } from './common';

export interface City extends Entity {
  postalCode: number | null;
  name: string | null;
}

export interface CityCreateInput{
  postalCode: number | null;
  name: string | null
}

export interface CityUpdateInput extends CityCreateInput {}

export interface CreateCityRequest extends CityCreateInput {}
export interface UpdateCityRequest extends CityUpdateInput {}

export interface GetAllCityResponse extends ListResponse<City> {}
export interface GetCityByIdResponse extends City {}
export interface CreateCityResponse extends GetCityByIdResponse {}
export interface UpdateCityResponse extends GetCityByIdResponse {}
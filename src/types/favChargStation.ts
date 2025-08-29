// src/types/favChargStation.ts
import type { Entity, ListResponse } from './common';

export interface FavChargStation extends Entity {
  user_id: number;
  chargingStation_id: number;
  username: { username: string }; // Matches Pick<User, 'username'>
  address: { streetName: string | null; houseNumber: number | null }; 
  // Matches Pick<Address, 'streetName' | 'houseNumber'>
}

export interface FavChargStationCreateInput{
  user_id: number;
  chargingStation_id:number;
}

export interface FavChargStationUpdateInput extends FavChargStationCreateInput {}

export interface CreateFavChargStationRequest extends Omit<FavChargStationCreateInput,'userId'> {}
export interface UpdateFavChargStationRequest extends Omit<FavChargStationUpdateInput,'userId'> {}

export interface GetAllFavChargStationsResponse extends ListResponse<FavChargStation> {}
export interface GetFavChargStationByIdResponse extends FavChargStation {}
export interface CreateFavChargStationResponse extends GetFavChargStationByIdResponse {}
export interface UpdateFavChargStationResponse extends GetFavChargStationByIdResponse {}
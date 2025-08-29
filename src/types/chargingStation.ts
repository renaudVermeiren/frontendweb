// src/types/chargingStation.ts
import type { Entity, ListResponse } from './common';

export interface ChargingStation extends Entity {
  address_id: number | null;
  numberOfSpaces: number | null;
}

export interface ChargingStationCreateInput{
  address_id: number | null;
  numberOfSpaces: number | null;
}

export interface ChargingStationUpdateInput extends ChargingStationCreateInput {}

export interface CreateChargingStationRequest extends ChargingStationCreateInput {}
export interface UpdateChargingStationRequest extends ChargingStationUpdateInput {}

export interface GetAllChargingStationsResponse extends ListResponse<ChargingStation> {}
export interface GetChargingStationByIdResponse extends ChargingStation {}
export interface CreateChargingStationResponse extends GetChargingStationByIdResponse {}
export interface UpdateChargingStationResponse extends GetChargingStationByIdResponse {}
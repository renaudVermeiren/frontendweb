// src/types/EVCharger.ts
import type { Entity, ListResponse } from './common';

export interface EVCharger extends Entity {
  chargingStation_id: number | null;
  name: string  |null;
  connectorType: string | null;
  chargeTime: number | null;
  rangePerHour: string | null;
  userCase: string | null;

}

export interface EVChargerCreateInput{
  chargingStation_id: number | null;
  name: string  |null;
  connectorType: string | null;
  chargeTime: number | null;
  rangePerHour: string | null;
  userCase: string | null;
}

export interface EVChargerUpdateInput extends EVChargerCreateInput {}

export interface CreateEVChargerRequest extends EVChargerCreateInput {}
export interface UpdateEVChargerRequest extends EVChargerUpdateInput {}

export interface GetAllEVChargersResponse extends ListResponse<EVCharger> {}
export interface GetEVChargerByIdResponse extends EVCharger {}
export interface CreateEVChargerResponse extends GetEVChargerByIdResponse {}
export interface UpdateEVChargerResponse extends GetEVChargerByIdResponse {}
// src/types/address.ts
import type { City } from './city';
import type { Entity, ListResponse } from './common';

export interface Address extends Entity {
  houseNumber: number| null;
  streetName: string | null;
  city: Pick< City, 'name'> | null;
}

export interface AddressCreateInput{
  houseNumber: number | null;
  streetName: string | null;
  city_id: number | null;
}

export interface AddressUpdateInput extends AddressCreateInput {}

export interface CreateAddressRequest extends AddressCreateInput {}
export interface UpdateAddressRequest extends AddressUpdateInput {}

export interface GetAllAddressResponse extends ListResponse<Address> {}
export interface GetAddressByIdResponse extends Address {}
export interface CreateAddressResponse extends GetAddressByIdResponse {}
export interface UpdateAddressResponse extends GetAddressByIdResponse {}
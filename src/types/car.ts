// src/types/car.ts
import type { Entity, ListResponse } from './common';
import type { User } from './user';

export interface Car extends Entity {
  carModel: string | null;
  year: number| null;
  numberPlate: string| null;
  user: Pick<User, 'username'>;
  capacity: string| null;
}

export interface CarCreateInput{
  carModel: string | null;
  year: number | null;
  numberPlate: string | null;
  user_id: number;
  capacity: string | null;
}

export interface CarUpdateInput extends CarCreateInput {}

export interface CreateCarRequest extends Omit<CarCreateInput,'userId'>{}
export interface UpdateCarRequest extends Omit<CarUpdateInput,'userId'> {}

export interface GetAllCarsResponse extends ListResponse<Car> {}
export interface GetCarByIdResponse extends Car {}
export interface CreateCarResponse extends GetCarByIdResponse {}
export interface UpdateCarResponse extends GetCarByIdResponse {}
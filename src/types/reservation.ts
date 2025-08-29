// src/types/resevation.ts
import type { Entity, ListResponse } from './common';
import type { User } from './user';

export interface Reservation extends Entity {
  chargingStation_id: number;
  user: Pick<User, 'username'>;
  startReservation: Date;
  endReservation: Date;
}

export interface ReservationCreateInput{
  chargingStation_id: number;
  user_id: number;
  startReservation: Date;
  endReservation: Date;
}

export interface ReservationUpdateInput extends ReservationCreateInput {}

export interface CreateReservationRequest extends Omit<ReservationCreateInput,'userId'>{}
export interface UpdateReservationRequest extends Omit<ReservationUpdateInput,'userId'>{}

export interface GetAllReservationsResponse extends ListResponse<Reservation> {}
export interface GetReservationByIdResponse extends Reservation {}
export interface CreateReservationResponse extends GetReservationByIdResponse {}
export interface UpdateReservationResponse extends GetReservationByIdResponse {}
// src/types/user.ts
import type { Prisma } from '@prisma/client';
import type { Address } from './address';
import type { Entity, ListResponse } from './common';

export interface User extends Entity {
  username: string;
  address: Pick<Address, 'houseNumber'|'streetName'|'city'> | null;
  email: string;
  password_hash: string;
  roles: Prisma.JsonValue;
}

export interface UserCreateInput{
  username: string;
  homeAddress_id: number | null;
  email: string;
  password: string;
}

export interface registerUser extends Entity{

  username: string;
  email: string;
  roles: Prisma.JsonValue;
  password_hash: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface PublicUser extends Pick<User, 'id'| 'username' |'address'| 'email'>{}

export interface UserUpdateInput extends Pick<UserCreateInput, 'username' | 'email'> {}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface GetUserRequest {
  id: number | 'me'
}

export interface RegisterUserRequest {
  username: string,
  email: string,
  password: string,
}

export interface LoginResponse {
  token: string,
}

export interface CreateUserRequest extends UserCreateInput{}
export interface UpdateUserRequest extends UserUpdateInput{}

export interface GetAllUsersResponse extends ListResponse<PublicUser> {}
export interface GetUserByIdResponse extends PublicUser {}
export interface CreateUserResponse extends GetUserByIdResponse {}
export interface UpdateUserResponse extends GetUserByIdResponse {}
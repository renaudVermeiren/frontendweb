// src/types/common.ts
export interface Entity {
  id: number;
}

export interface ListResponse<T> {
  items: T[];
}

export interface IdParams{
  id: number;
}
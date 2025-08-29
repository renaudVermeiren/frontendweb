// src/types/koa.ts
import type { ParameterizedContext } from 'koa';
import type Application from 'koa';
import type Router from '@koa/router';
import type { SessionInfo } from './auth';

export interface EVAppState {
  session: SessionInfo;
}

export interface EVAppContext<
  Params = unknown,
  RequestBody = unknown,
  Query = unknown,
> {
  request: {
    body: RequestBody;
    query: Query;
  };
  params: Params;
}

export type KoaContext<
  ResponseBody = unknown,
  Params = unknown,
  RequestBody = unknown,
  Query = unknown,
> = 
ParameterizedContext<
  EVAppState,
  EVAppContext<Params, RequestBody, Query>,
  ResponseBody
>;

export interface KoaApplication
  extends Application<EVAppState, EVAppContext> {}

export interface KoaRouter extends Router<EVAppState, EVAppContext> {}

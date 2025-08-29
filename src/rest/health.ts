// src/rest/health.ts
import Router from '@koa/router';
import * as healthService from '../service/health';
import type { EVAppContext, EVAppState, KoaRouter} from '../types/koa';
import { type KoaContext } from '../types/koa';
import type { PingResponse, VersionResponse } from '../types/health';
import validate from '../core/validation';

const ping = async (ctx: KoaContext<PingResponse>) => {
  ctx.status = 200;
  ctx.body = healthService.ping();
};

ping.validationScheme = null;

const getVersion = async (ctx: KoaContext<VersionResponse>) => {
  ctx.status = 200;
  ctx.body = healthService.getVersion();
};

getVersion.validationScheme = null;

export default (parent: KoaRouter) => {
  const router = new Router<EVAppState,EVAppContext>({ prefix: '/health' });

  router.get('/ping', validate(ping.validationScheme),ping);
  router.get('/version', validate(getVersion.validationScheme),getVersion);

  parent
    .use(router.routes())
    .use(router.allowedMethods());
};

// src/rest/index.ts
import Router from '@koa/router';
import installCarRouter from './car';
import installhealthRouter from './health';
import installUserRouter from './user';
import installCityRouter from './city';
import installAddressRouter from './address';
import installChargingStationRouter from './chargingStation';
import installFavChargingStationRouter from './favChargStation';
import installEVChargerRouter from './EVCharger';
import installReservationRouter from './reservation';
import type { EVAppContext, EVAppState, KoaApplication } from '../types/koa';
import installSessionRouter from './session';

export default (app: KoaApplication) => {
  const router = new Router<EVAppState, EVAppContext>({
    prefix: '/api',
  });

  installCarRouter(router);
  installhealthRouter(router);
  installUserRouter(router);
  installCityRouter(router);
  installAddressRouter(router);
  installChargingStationRouter(router);
  installFavChargingStationRouter(router);
  installEVChargerRouter(router);
  installReservationRouter(router);
  installSessionRouter(router);
  
  app.use(router.routes()).use(router.allowedMethods());
};

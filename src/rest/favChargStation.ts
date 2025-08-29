import Router from '@koa/router';
import * as favChargStationService from '../service/favChargStation';
import type { EVAppContext, EVAppState } from '../types/koa';
import type { KoaContext, KoaRouter } from '../types/koa';
import type {
  CreateFavChargStationRequest,
  CreateFavChargStationResponse,
  GetAllFavChargStationsResponse,
  GetFavChargStationByIdResponse,
  UpdateFavChargStationRequest,
  UpdateFavChargStationResponse,
} from '../types/favChargStation';
import type { IdParams } from '../types/common';
import validate from '../core/validation';
import { requireAuthentication } from '../core/auth';
import { z } from 'zod';

/**
 * @swagger
 * tags:
 *   - name: FavoriteChargingStations
 *     description: Endpoints voor het beheren van favoriete laadstations (wordt alleen gebruikt door administrators)
 *
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 *   schemas:
 *     FavChargStation:
 *       type: object
 *       required:
 *         - id
 *         - user_id
 *         - chargingStation_id
 *       properties:
 *         id:
 *           type: integer
 *           description: ID van de favorite record
 *         user_id:
 *           type: integer
 *           description: ID van de gebruiker die favoriet heeft toegevoegd
 *         chargingStation_id:
 *           type: integer
 *           description: ID van het laadstation
 *         username:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *         address:
 *           type: object
 *           properties:
 *             streetName:
 *               type: string
 *               nullable: true
 *             houseNumber:
 *               type: integer
 *               nullable: true
 *       example:
 *         id: 1
 *         user_id: 123
 *         chargingStation_id: 101
 *         username:
 *           username: janedoe
 *         address:
 *           streetName: Veldstraat
 *           houseNumber: 12
 *
 *     CreateFavChargStationRequest:
 *       type: object
 *       required:
 *         - chargingStation_id
 *       properties:
 *         chargingStation_id:
 *           type: integer
 *       example:
 *         chargingStation_id: 101
 *
 *     CreateFavChargStationResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         user_id:
 *           type: integer
 *         chargingStation_id:
 *           type: integer
 *         username:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *         address:
 *           type: object
 *           properties:
 *             streetName:
 *               type: string
 *             houseNumber:
 *               type: integer
 *       example:
 *         id: 1
 *         user_id: 123
 *         chargingStation_id: 101
 *         username:
 *           username: janedoe
 *         address:
 *           streetName: Veldstraat
 *           houseNumber: 12
 *
 *     UpdateFavChargStationRequest:
 *       type: object
 *       required:
 *         - chargingStation_id
 *       properties:
 *         chargingStation_id:
 *           type: integer
 *       example:
 *         chargingStation_id: 102
 *
 *     UpdateFavChargStationResponse:
 *       $ref: '#/components/schemas/CreateFavChargStationResponse'
 *
 *     ItemsFavChargingStationResponse:
 *       type: object
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/FavChargStation'
 */

/**
 * @swagger
 * /favoriteChargingStations:
 *   get:
 *     tags:
 *       - FavoriteChargingStations
 *     summary: Haal alle favoriete laadstations van de ingelogde gebruiker
 *     description: Retourneert alle favoriteChargingStation records voor de geauthenticeerde 
 *                  gebruiker (gebaseerd op sessie).
 *     operationId: getAllFavChargStations
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lijst van favoriete laadstations
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ItemsFavChargingStationResponse'
 *         examples:
 *           example-1:
 *             value:
 *               items:
 *                 - id: 1
 *                   user_id: 123
 *                   chargingStation_id: 101
 *
 *   post:
 *     tags:
 *       - FavoriteChargingStations
 *     summary: Voeg een favoriet laadstation toe voor de ingelogde gebruiker
 *     description: Maakt een nieuwe favoriteChargingStation voor de ingelogde gebruiker (user bepaald via sessie).
 *     operationId: createFavChargStation
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       description: Charging station dat toegevoegd moet worden als favoriet
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateFavChargStationRequest'
 *     responses:
 *       201:
 *         description: Favoriet succesvol aangemaakt
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateFavChargStationResponse'
 *       400:
 *         description: Ongeldige input
 *       401:
 *         description: Niet geautoriseerd
 *
 * /favoriteChargingStations/{id}:
 *   get:
 *     tags:
 *       - FavoriteChargingStations
 *     summary: Haal een favoriete record op op ID
 *     description: Haalt een specifieke favoriteChargingStation 
 *                  op op basis van zijn ID — de gebruiker moet geauthenticeerd zijn en eigenaar zijn of admin.
 *     operationId: getFavChargStationById
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID van de favoriteChargingStation
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Favoriet record
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FavChargStation'
 *       401:
 *         description: Niet geautoriseerd
 *       404:
 *         description: Niet gevonden
 *
 *   put:
 *     tags:
 *       - FavoriteChargingStations
 *     summary: Werk een favoriete record bij
 *     description: Update de chargingStation_id van een favorite record (alleen door eigenaar of admin).
 *     operationId: updateFavChargStation
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID van de favoriteChargingStation die geüpdatet moet worden
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Nieuwe chargingStation id
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateFavChargStationRequest'
 *     responses:
 *       200:
 *         description: Gewijzigde favorite record
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateFavChargStationResponse'
 *       400:
 *         description: Ongeldige input
 *       401:
 *         description: Niet geautoriseerd
 *       404:
 *         description: Niet gevonden
 *
 *   delete:
 *     tags:
 *       - FavoriteChargingStations
 *     summary: Verwijder een favorite record
 *     description: Verwijdert een favoriteChargingStation op basis van ID (eigenaar of admin).
 *     operationId: deleteFavChargStation
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID van de favoriteChargingStation die verwijderd moet worden
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Verwijderd (No Content)
 *       401:
 *         description: Niet geautoriseerd
 *       404:
 *         description: Niet gevonden
 */

const getAllFavChargStations = async (ctx: KoaContext<GetAllFavChargStationsResponse>) => {
  const station = await favChargStationService.getAll(ctx.state.session.userId, ctx.state.session.roles);
  ctx.body = {
    items: station,
  };
};

getAllFavChargStations.validationScheme = null;

const createFavChargStation = async (ctx: KoaContext<CreateFavChargStationResponse, void,
  CreateFavChargStationRequest>) => {
  const newFavChargStation = await favChargStationService.create({
    ...ctx.request.body,
    user_id:ctx.state.session.userId,
  },
  );
  ctx.status = 201;
  ctx.body = newFavChargStation;
};

createFavChargStation.validationScheme = {
  body: z.object({
    chargingStation_id: z.coerce.number().int(),
  }),
};

const getFavChargStationById = async (ctx: KoaContext<GetFavChargStationByIdResponse, IdParams>) => {
  const car= await favChargStationService.getById(ctx.params.id,ctx.state.session.userId,ctx.state.session.roles);
  ctx.body=car;
};

getFavChargStationById.validationScheme = {
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
};

const updateFavChargStation = async (ctx: KoaContext<UpdateFavChargStationResponse, IdParams,
  UpdateFavChargStationRequest>) => {
  ctx.body = await favChargStationService.updateById((ctx.params.id), {
    ...ctx.request.body,
    user_id: ctx.state.session.userId,
  },
  );
};

updateFavChargStation.validationScheme = {
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
  body: z.object({
    chargingStation_id: z.coerce.number().int(),
  }),
};

export default (parent: KoaRouter) => {
  const router = new Router<EVAppState, EVAppContext>({
    prefix: '/favoriteChargingStations',
  });

  router.get('/',requireAuthentication,validate(getAllFavChargStations.validationScheme),getAllFavChargStations);
  router.post('/',requireAuthentication,validate(createFavChargStation.validationScheme), createFavChargStation);
  router.get('/:id',requireAuthentication,validate(getFavChargStationById.validationScheme), getFavChargStationById);
  router.put('/:id',requireAuthentication,validate(updateFavChargStation.validationScheme), updateFavChargStation);

  parent.use(router.routes()).use(router.allowedMethods());
};

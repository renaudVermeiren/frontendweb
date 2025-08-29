import Router from '@koa/router';
import * as userService from '../service/user';
import * as carService from '../service/car';
import * as favChargingStationService from '../service/favChargStation';
import * as reservationService from '../service/reservation';
import type { EVAppContext, EVAppState, KoaContext, KoaRouter } from '../types/koa';
import type { GetAllUsersResponse, 
  GetUserByIdResponse, LoginResponse, RegisterUserRequest, UpdateUserRequest, UpdateUserResponse } from '../types/user';
import type { IdParams } from '../types/common';
import type { GetAllCarsResponse } from '../types/car';
import type { CreateFavChargStationRequest, CreateFavChargStationResponse, GetAllFavChargStationsResponse } 
  from '../types/favChargStation';
import type { GetAllReservationsResponse } from '../types/reservation';
import validate from '../core/validation';
import { requireAuthentication, makeRequireRole,authDelay } from '../core/auth';
import Role from '../core/roles';
import type { Next } from 'koa';
import type {
  GetUserRequest,
} from '../types/user';
import { z } from 'zod';

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: Endpoints for user management, cars, reservations and favorites
 *
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 *   schemas:
 *     PublicUser:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         address:
 *           type: object
 *           properties:
 *             houseNumber:
 *               type: integer
 *             streetName:
 *               type: string
 *             city:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *       example:
 *         id: 5
 *         username: janedoe
 *         email: jane@example.com
 *         address:
 *           houseNumber: 12
 *           streetName: Veldstraat
 *           city:
 *             name: Gent
 *
 *     Car:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         carModel:
 *           type: string
 *         year:
 *           type: integer
 *         numberPlate:
 *           type: string
 *         capacity:
 *           type: string
 *         user:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *       example:
 *         id: 1
 *         carModel: Tesla Model 3
 *         year: 2021
 *         numberPlate: TES-001
 *         capacity: 5-seater
 *         user:
 *           username: janedoe
 *
 *     Reservation:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         chargingStation_id:
 *           type: integer
 *         user_id:
 *           type: integer
 *         startReservation:
 *           type: string
 *           format: date-time
 *         endReservation:
 *           type: string
 *           format: date-time
 *       example:
 *         id: 10
 *         chargingStation_id: 3
 *         user_id: 5
 *         startReservation: '2024-12-19T10:00:00Z'
 *         endReservation: '2024-12-19T12:00:00Z'
 *
 *     RegisterUserRequest:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           maxLength: 255
 *         homeAddress_id:
 *           type: integer
 *           nullable: true
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           minLength: 8
 *           maxLength: 128
 *       required:
 *         - email
 *         - password
 *       example:
 *         username: janedoe
 *         homeAddress_id: 2
 *         email: jane@example.com
 *         password: MySecret123
 *
 *     LoginResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *       example:
 *         token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *
 *     ItemsResponse:
 *       type: object
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             type: object
 */

/**
 * @swagger
 * /users/{id}/cars:
 *   get:
 *     tags:
 *       - Users
 *     summary: Haal auto's van een gebruiker op
 *     description: Haalt alle auto's op voor de gegeven user. :id kan een nummer of de string "me" zijn.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User id of "me"
 *         schema:
 *           type: string
 *           example: me
 *     responses:
 *       200:
 *         description: Lijst met auto's
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Car'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /users/{id}/favoriteChargingStations:
 *   get:
 *     tags:
 *       - Users
 *     summary: Haal favoriete laadstations van een gebruiker op
 *     description: Haalt de favorieten op van user :id (kan "me" zijn).
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User id of "me"
 *         schema:
 *           type: string
 *           example: me
 *     responses:
 *       200:
 *         description: Lijst met favoriete laadstations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Reservation' # vervang door favorite schema indien gewenst
 *       401:
 *         description: Unauthorized
 *
 *   post:
 *     tags:
 *       - Users
 *     summary: Voeg een favoriet laadstation toe voor de ingelogde gebruiker
 *     description: Voegt een favoriet laadstation toe; user wordt bepaald via sessie (me).
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User id of "me"
 *         schema:
 *           type: string
 *           example: me
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chargingStation_id:
 *                 type: integer
 *             required:
 *               - chargingStation_id
 *             example:
 *               chargingStation_id: 7
 *     responses:
 *       201:
 *         description: Favoriet aangemaakt
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 user_id:
 *                   type: integer
 *                 chargingStation_id:
 *                   type: integer
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /users/{id}/favoriteChargingStations/{station_id}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Verwijder een favoriet laadstation van de ingelogde gebruiker
 *     description: Verwijdert het favorite record voor de ingelogde user (user uit sessie). :id in path kan "me".
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User id of "me"
 *         schema:
 *           type: string
 *           example: me
 *       - name: station_id
 *         in: path
 *         required: true
 *         description: ID van het laadstation dat verwijderd moet worden uit favorites
 *         schema:
 *           type: integer
 *           example: 7
 *     responses:
 *       204:
 *         description: Favoriet verwijderd
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 */

/**
 * @swagger
 * /users/{id}/reservations:
 *   get:
 *     tags:
 *       - Users
 *     summary: Haal reservaties van een gebruiker op
 *     description: Haalt reservaties op voor user :id (kan "me" zijn).
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User id of "me"
 *         schema:
 *           type: string
 *           example: me
 *     responses:
 *       200:
 *         description: Lijst met reservaties
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Reservation'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Haal alle gebruikers op (admin)
 *     description: Alleen toegankelijk voor admins
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lijst met users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PublicUser'
 *       403:
 *         description: Forbidden
 *
 *   post:
 *     tags:
 *       - Users
 *     summary: Registreer een nieuwe gebruiker
 *     description: Maak een nieuwe user aan en geef een JWT terug
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterUserRequest'
 *     responses:
 *       200:
 *         description: Registratie gelukt, token terug
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Haal één gebruiker op
 *     description: Haalt één gebruiker op. :id kan "me".
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: me
 *     responses:
 *       200:
 *         description: Geeft een PublicUser terug
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PublicUser'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 *
 *   put:
 *     tags:
 *       - Users
 *     summary: Werk een gebruiker bij
 *     description: Update velden van een gebruiker (alleen eigen gebruiker of admin)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               username:
 *                 type: string
 *               homeAddress_id:
 *                 type: integer
 *             example:
 *               username: newname
 *               homeAddress_id: 3
 *     responses:
 *       200:
 *         description: Updated user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PublicUser'
 *       400:
 *         description: Bad request
 *
 *   delete:
 *     tags:
 *       - Users
 *     summary: Verwijder een gebruiker (admin only)
 *     description: Verwijdert een gebruiker. Alleen toegankelijk voor admins.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Deleted
 *       403:
 *         description: Forbidden
 */

const getCarsByUserId = async (ctx: KoaContext<GetAllCarsResponse,GetUserRequest>) => {
  const cars = await carService.getCarsByUserId(
    ctx.params.id==='me' ? ctx.state.session.userId : ctx.params.id,
  );
  ctx.body = {
    items: cars,
  };
};

getCarsByUserId.validationScheme = {
  params: z.object({
    id: z.union([
      z.coerce.number().int().positive(),
      z.literal('me'),
    ]),
  }),
};

const getFavChargStationByUserId = async (ctx: KoaContext<GetAllFavChargStationsResponse,GetUserRequest>) =>{
  const stations = await favChargingStationService.getFavsByUserId(
    ctx.params.id==='me' ? ctx.state.session.userId : ctx.params.id,
  );
  ctx.body= {
    items: stations,
  };
};

getFavChargStationByUserId.validationScheme = {
  params: z.object({
    id: z.union([
      z.coerce.number().int().positive(),
      z.literal('me'),
    ]),
  }),
};

const getReservationsByUserIdService = async(ctx: KoaContext<GetAllReservationsResponse,GetUserRequest>) => {
  const reservations = await reservationService.getReservationsByUserId(
    ctx.params.id==='me' ? ctx.state.session.userId : ctx.params.id,
  );
  ctx.body = {
    items: reservations,
  };
};

getReservationsByUserIdService.validationScheme = {
  params: z.object({
    id: z.union([
      z.coerce.number().int().positive(),
      z.literal('me'),
    ]),
  }),
};

const getAllUsers = async (ctx: KoaContext<GetAllUsersResponse>) => {
  const users = await userService.getAll();
  ctx.body={
    items: users,
  };
};

getAllUsers.validationScheme = null;

const registerUser = async (ctx: KoaContext<LoginResponse, void, RegisterUserRequest>) => {
  const token = await userService.register(
    ctx.request.body,
  );
  ctx.status = 201;
  ctx.body = {token};

};

registerUser.validationScheme = {
  body: z.object({
    username: z.string().max(255),
    homeAddress_id: z.coerce.number().int().optional(),
    email: z.string(),
    password: z.string().min(8).max(128),
  }),
};

const getUserById = async (ctx: KoaContext<GetUserByIdResponse, GetUserRequest>) => {
  const user = await userService.getById(
    ctx.params.id==='me' ? ctx.state.session.userId : ctx.params.id,
  );
  ctx.body=user;
};

getUserById.validationScheme = {
  params: z.object({
    id: z.union([
      z.coerce.number().int().positive(),
      z.literal('me'),
    ]),
  }),
};

const updateUser = async (ctx: KoaContext<UpdateUserResponse, IdParams, UpdateUserRequest>) => {
  ctx.body= await userService.updateById((ctx.params.id), ctx.request.body);
};

updateUser.validationScheme = {
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
  body: z.object({
    id: z.coerce.number().int().optional(),
    username: z.string().optional(),
    homeAddress_id: z.coerce.number().int().optional(),
  }),
};

const deleteUser = async (ctx: KoaContext<void, IdParams>) => {
  await userService.deleteById(ctx.params.id);
  ctx.status = 204;
};

deleteUser.validationScheme = {
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
};

const createFavChargStation = async (ctx: KoaContext<CreateFavChargStationResponse, 
  GetUserRequest, CreateFavChargStationRequest>) => {
  const newFavChargStation = await favChargingStationService.create({
    ...ctx.request.body,
    user_id: ctx.state.session.userId,
  });
  ctx.status = 201;
  ctx.body = newFavChargStation;
};

createFavChargStation.validationScheme = {
  params: z.object({
    id: z.union([
      z.coerce.number().int().positive(),
      z.literal('me'),
    ]),
  }),
  body: z.object({
    chargingStation_id: z.coerce.number().int(),
  }),
};

const deleteFavChargStation = async (ctx: KoaContext<void, GetUserRequest & { station_id: string }>) => {
  // params
  const idParam = ctx.state.session.userId;
  const stationParam = Number(ctx.params.station_id);

  await favChargingStationService.deleteById(idParam, stationParam);

  ctx.status = 204;
  
};

deleteFavChargStation.validationScheme ={
  params: z.object({
    id: z.union([z.coerce.number().int().positive(), z.literal('me')]),
    station_id: z.coerce.number().int().positive(),
  }),
};

const checkUserId = (ctx: KoaContext<unknown, GetUserRequest>, next: Next) => {
  const { userId, roles } = ctx.state.session;
  const { id } = ctx.params;

  // You can only get our own data unless you're an admin
  if (id !== 'me' && id !== userId && !roles.includes(Role.ADMIN)) {
    return ctx.throw(
      403,
      'You are not allowed to view this user\'s information',
      { code: 'FORBIDDEN' },
    );
  }
  return next();
};

export default (parent: KoaRouter) => {
  const router = new Router<EVAppState,EVAppContext>({
    prefix: '/users',
  });

  router.post('/',authDelay,validate(registerUser.validationScheme),registerUser);
  const requireAdmin = makeRequireRole(Role.ADMIN);

  router.get('/:id/cars',requireAuthentication, validate(getCarsByUserId.validationScheme),checkUserId,getCarsByUserId);
  router.get('/:id/favoriteChargingStations',requireAuthentication,
    validate(getFavChargStationByUserId.validationScheme),checkUserId,
    getFavChargStationByUserId);
  router.get('/',requireAuthentication,requireAdmin,validate(getAllUsers.validationScheme),getAllUsers);
  router.get('/:id',requireAuthentication,validate(getUserById.validationScheme),checkUserId,getUserById);
  
  router.put('/:id',requireAuthentication,validate(updateUser.validationScheme),checkUserId,updateUser);
  router.delete('/:id',requireAuthentication,requireAdmin,validate(deleteUser.validationScheme),deleteUser);
  router.get('/:id/reservations',requireAuthentication,validate(getReservationsByUserIdService.validationScheme),
    checkUserId,getReservationsByUserIdService);
    
  router.post('/:id/favoriteChargingStations',requireAuthentication,
    validate(createFavChargStation.validationScheme),checkUserId,createFavChargStation);

  router.delete('/:id/favoriteChargingStations/:station_id', requireAuthentication,
    validate(deleteFavChargStation.validationScheme),
    checkUserId,deleteFavChargStation);

  parent.use(router.routes()).use(router.allowedMethods());
};

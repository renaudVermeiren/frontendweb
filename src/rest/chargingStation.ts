import Router from '@koa/router';
import * as chargingStationService from '../service/chargingStation';
import * as EVChargerService from '../service/EVCharger';
import type { EVAppContext, EVAppState } from '../types/koa';
import type { KoaContext, KoaRouter } from '../types/koa';
import type {
  CreateChargingStationRequest,
  CreateChargingStationResponse,
  GetAllChargingStationsResponse,
  GetChargingStationByIdResponse,
  UpdateChargingStationRequest,
  UpdateChargingStationResponse,
} from '../types/chargingStation';
import type { IdParams } from '../types/common';
import type { GetAllEVChargersResponse } from '../types/EVCharger';
import validate from '../core/validation';
import { makeRequireRole, requireAuthentication } from '../core/auth';
import { z } from 'zod';
import Role from '../core/roles'; 

/**
 * @swagger
 * tags:
 *   name: ChargingStation
 *   description: API endpoints for managing charging stations and related EV chargers
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * 
 *   schemas:
 *     ChargingStation:
 *       type: object
 *       required:
 *         - id
 *         - address_id
 *         - numberOfSpaces
 *       properties:
 *         id:
 *           type: integer
 *           description: The charging station ID
 *         address_id:
 *           type: integer
 *           description: The associated address ID of the charging station
 *         numberOfSpaces:
 *           type: integer
 *           description: The number of spaces available at the charging station
 *       example:
 *         id: 1
 *         address_id: 10
 *         numberOfSpaces: 5
 */

/**
 * @swagger
 * /api/chargingStations:
 *   get:
 *     tags:
 *       - ChargingStation
 *     summary: Get all charging stations
 *     description: Fetches a list of all charging stations
 *     operationId: getAllChargingStation
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of charging stations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ChargingStation'
 * 
 *   post:
 *     tags:
 *       - ChargingStation
 *     summary: Create a new charging station
 *     description: Creates a new charging station and returns the created station
 *     operationId: createChargingStation
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       description: The details of the charging station to create
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChargingStation'
 *     responses:
 *       201:
 *         description: Charging station created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChargingStation'
 * 
 * /api/chargingStations/{id}:
 *   get:
 *     tags:
 *       - ChargingStation
 *     summary: Get charging station by ID
 *     description: Fetches the details of a charging station by its ID
 *     operationId: getChargingStationById
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the charging station
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Charging station details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChargingStation'
 *       404:
 *         description: Charging station not found
 * 
 *   put:
 *     tags:
 *       - ChargingStation
 *     summary: Update charging station details
 *     description: Updates the details of an existing charging station
 *     operationId: updateChargingStation
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the charging station
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       description: The updated details of the charging station
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChargingStation'
 *     responses:
 *       200:
 *         description: Charging station updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChargingStation'
 * 
 *   delete:
 *     tags:
 *       - ChargingStation
 *     summary: Delete a charging station
 *     description: Deletes a charging station by ID
 *     operationId: deleteChargingStation
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the charging station to delete
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       204:
 *         description: Charging station deleted successfully
 * 
 * /api/chargingStations/{id}/EVChargers:
 *   get:
 *     tags:
 *       - ChargingStation
 *     summary: Get all EV chargers for a charging station
 *     description: Fetches a list of EV chargers associated with a specific charging station
 *     operationId: getAllEVChargersByChargingStationId
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the charging station
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: A list of EV chargers for the charging station
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/EVCharger'
 *       404:
 *         description: Charging station not found
 */

const getAllChargingStation = async (ctx: KoaContext<GetAllChargingStationsResponse>) => {
  const chargingStation = await chargingStationService.getAll();
  ctx.body = {
    items: chargingStation,
  };
};
getAllChargingStation.validationScheme = null;

const createChargingStation = async (ctx: KoaContext<CreateChargingStationResponse,
  void, CreateChargingStationRequest>) => {
  const newChargingStation = await chargingStationService.create(
    ctx.request.body,
  );
  ctx.status = 201;
  ctx.body = newChargingStation;
};

// Aantal laadpunten moet groter zijn dan 0
createChargingStation.validationScheme= {
  body: z.object({
    id: z.coerce.number().int().optional(),
    address_id: z.coerce.number().int().optional(),
    numberOfSpaces: z.coerce.number().int().refine((val) => val !== 0, {
      message: 'Number of spaces cannot be 0',
    }).optional(),
  }),
};

const getChargingStationById = async (ctx: KoaContext<GetChargingStationByIdResponse, IdParams>) => {
  const chargingStation= await chargingStationService.getById(ctx.params.id);
  ctx.body=chargingStation;
};

getChargingStationById.validationScheme =  {
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
};

const updateChargingStation = async (ctx: KoaContext<UpdateChargingStationResponse, 
  IdParams, UpdateChargingStationRequest>) => {
  ctx.body = await chargingStationService.updateById(ctx.params.id, ctx.request.body,
  );
};

updateChargingStation.validationScheme = {
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
  body: z.object({
    id: z.coerce.number().int().optional(),
    address_id: z.coerce.number().int().optional(),
    numberOfSpaces: z.coerce.number().int().optional().refine((val) => val !== 0, {
      message: 'numberOfSpaces cannot be 0',
    }),
  }),
};

const deleteChargingStation = async (ctx: KoaContext<void, IdParams>) => {
  await chargingStationService.deleteById(ctx.params.id);
  ctx.status = 204;
};

deleteChargingStation.validationScheme = {
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
};

const getAllEVChargersByChargingStationId = async (ctx: KoaContext<GetAllEVChargersResponse,IdParams>) => {
  const chargers = await EVChargerService.getEVChargersByChargingStationId(
    ctx.params.id,
  );
  ctx.body = {
    items: chargers,
  };
};

getAllEVChargersByChargingStationId.validationScheme = {
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
};

export default (parent: KoaRouter) => {
  const router = new Router<EVAppState, EVAppContext>({
    prefix: '/chargingStations',
  });
  
  const requireAdmin = makeRequireRole(Role.ADMIN);

  router.get('/', requireAuthentication,validate(getAllChargingStation.validationScheme),getAllChargingStation);
  router.get('/:id/EVChargers',requireAuthentication
    ,requireAdmin,validate(getAllEVChargersByChargingStationId.validationScheme),
    getAllEVChargersByChargingStationId);
  router.post('/',requireAuthentication,
    requireAdmin,validate(createChargingStation.validationScheme), createChargingStation);
  router.get('/:id',requireAuthentication,validate(getChargingStationById.validationScheme), getChargingStationById);
  router.put('/:id',requireAuthentication,requireAdmin,
    validate(updateChargingStation.validationScheme),updateChargingStation);
  router.delete('/:id',requireAuthentication,requireAdmin, 
    validate(deleteChargingStation.validationScheme),deleteChargingStation);

  parent.use(router.routes()).use(router.allowedMethods());
};

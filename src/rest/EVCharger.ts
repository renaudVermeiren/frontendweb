import Router from '@koa/router';
import * as EVChargerService from '../service/EVCharger';
import type { EVAppContext, EVAppState } from '../types/koa';
import type { KoaContext, KoaRouter } from '../types/koa';
import type {
  CreateEVChargerRequest,
  CreateEVChargerResponse,
  GetAllEVChargersResponse,
  GetEVChargerByIdResponse,
  UpdateEVChargerRequest,
  UpdateEVChargerResponse,
} from '../types/EVCharger';
import type { IdParams } from '../types/common';
import validate from '../core/validation';
import { makeRequireRole, requireAuthentication } from '../core/auth';
import { z } from 'zod';
import Role from '../core/roles'; 

/**
 * @swagger
 * tags:
 *   name: EVChargers
 *   description: API endpoints for managing EV chargers
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
 *     EVCharger:
 *       type: object
 *       required:
 *         - id
 *         - chargingStation_id
 *         - name
 *         - connectorType
 *         - chargeTime
 *         - rangePerHour
 *         - userCase
 *       properties:
 *         id:
 *           type: integer
 *           description: The EV charger ID
 *         chargingStation_id:
 *           type: integer
 *           description: The ID of the charging station the EV charger belongs to
 *         name:
 *           type: string
 *           description: The name of the EV charger
 *         connectorType:
 *           type: string
 *           description: The connector type for the EV charger (e.g., Type 1, Type 2)
 *         chargeTime:
 *           type: integer
 *           description: Time it takes to fully charge a vehicle in minutes
 *         rangePerHour:
 *           type: string
 *           description: The estimated range of the EV per hour of charging (in km or miles)
 *         userCase:
 *           type: string
 *           description: The use case for the EV charger (e.g., home, public, fleet)
 *       example:
 *         id: 1
 *         chargingStation_id: 101
 *         name: "Fast Charger 1"
 *         connectorType: "Type 2"
 *         chargeTime: 60
 *         rangePerHour: "100 km"
 *         userCase: "Public"
 */

/**
 * @swagger
 * /api/EVChargers:
 *   get:
 *     tags:
 *       - EVChargers
 *     summary: Get all EV chargers
 *     description: Fetches a list of all EV chargers
 *     operationId: getAllEVChargers
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of EV chargers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/EVCharger'
 * 
 *   post:
 *     tags:
 *       - EVChargers
 *     summary: Create a new EV charger
 *     description: Creates a new EV charger and returns the created charger
 *     operationId: createEVCharger
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       description: The details of the EV charger to create
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EVCharger'
 *     responses:
 *       201:
 *         description: EV charger created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EVCharger'
 * 
 * /api/EVChargers/{id}:
 *   get:
 *     tags:
 *       - EVChargers
 *     summary: Get EV charger by ID
 *     description: Fetches the details of an EV charger by its ID
 *     operationId: getEVChargerById
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the EV charger
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: EV charger details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EVCharger'
 *       404:
 *         description: EV charger not found
 * 
 *   put:
 *     tags:
 *       - EVChargers
 *     summary: Update EV charger details
 *     description: Updates the details of an existing EV charger
 *     operationId: updateEVCharger
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the EV charger
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       description: The updated details of the EV charger
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EVCharger'
 *     responses:
 *       200:
 *         description: EV charger updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EVCharger'
 * 
 *   delete:
 *     tags:
 *       - EVChargers
 *     summary: Delete an EV charger
 *     description: Deletes an EV charger by ID
 *     operationId: deleteEVCharger
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the EV charger to delete
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       204:
 *         description: EV charger deleted successfully
 */

const getAllEVChargers = async (ctx: KoaContext<GetAllEVChargersResponse>) => {
  const EVcharger = await EVChargerService.getAll();
  ctx.body = {
    items: EVcharger,
  };
};

getAllEVChargers.validationScheme = null;

const createEVCharger = async (ctx: KoaContext<CreateEVChargerResponse, void, CreateEVChargerRequest>) => {
  const newEVCharger = await EVChargerService.create(
    ctx.request.body,
  );
  ctx.status = 201;
  ctx.body = newEVCharger;
};

createEVCharger.validationScheme = {
  body: z.object({
    id: z.coerce.number().int().optional(),
    chargingStation_id: z.coerce.number().int().optional(),
    name: z.string().optional(),
    connectorType: z.string().optional(),
    chargeTime: z.coerce.number().int().optional(),
    rangePerHour: z.string().optional(),
    userCase: z.string().optional(),
  }),
};

const getEVChargerById = async (ctx: KoaContext<GetEVChargerByIdResponse, IdParams>) => {
  const EVCharger= await EVChargerService.getById((ctx.params.id));
  ctx.body=EVCharger;
};

getEVChargerById.validationScheme = {
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
};

const updateEVCharger = async (ctx: KoaContext<UpdateEVChargerResponse, IdParams, UpdateEVChargerRequest>) => {
  ctx.body = await EVChargerService.updateById((ctx.params.id), ctx.request.body,
  );
};

updateEVCharger.validationScheme = {
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
  body: z.object({
    id: z.coerce.number().int().optional(),
    chargingStation_id: z.coerce.number().int().optional(),
    name: z.string().optional(),
    connectorType: z.string().optional(),
    chargeTime: z.coerce.number().int().optional(),
    rangePerHour: z.string().optional(),
    userCase: z.string().optional(),
  }),
};

const deleteEVCharger = async (ctx: KoaContext<void, IdParams>) => {
  await EVChargerService.deleteById((ctx.params.id));
  ctx.status = 204;
};

deleteEVCharger.validationScheme = {
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
};

export default (parent: KoaRouter) => {
  const router = new Router<EVAppState, EVAppContext>({
    prefix: '/EVChargers',
  });

  const requireAdmin = makeRequireRole(Role.ADMIN);

  router.get('/',requireAuthentication,validate(getAllEVChargers.validationScheme) ,getAllEVChargers);
  router.post('/',requireAuthentication,validate(createEVCharger.validationScheme) , createEVCharger);
  router.get('/:id', requireAuthentication,validate(getEVChargerById.validationScheme) ,getEVChargerById);
  router.put('/:id',requireAuthentication,requireAdmin, validate(updateEVCharger.validationScheme) ,updateEVCharger);
  router.delete('/:id',requireAuthentication, validate(deleteEVCharger.validationScheme) ,deleteEVCharger);

  parent.use(router.routes()).use(router.allowedMethods());
};

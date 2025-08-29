import Router from '@koa/router';
import * as cityService from '../service/city';
import type { EVAppContext, EVAppState } from '../types/koa';
import type { KoaContext, KoaRouter } from '../types/koa';
import type {
  CreateCityRequest,
  CreateCityResponse,
  GetAllCityResponse,
  GetCityByIdResponse,
  UpdateCityRequest,
  UpdateCityResponse,
} from '../types/city';
import type { IdParams } from '../types/common';
import validate from '../core/validation';
import { makeRequireRole, requireAuthentication } from '../core/auth';
import { z } from 'zod';
import Role from '../core/roles'; 

/**
 * @swagger
 * tags:
 *   name: City
 *   description: API endpoints for managing cities
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
 *     City:
 *       type: object
 *       required:
 *         - id
 *         - name
 *       properties:
 *         id:
 *           type: integer
 *           description: The city ID
 *         postalCode:
 *           type: integer
 *           description: The postal code of the city
 *         name:
 *           type: string
 *           description: The name of the city
 *       example:
 *         id: 1
 *         postalCode: 12345
 *         name: "New York"
 */

/**
 * @swagger
 * /api/city:
 *   get:
 *     tags:
 *       - City
 *     summary: Get all cities
 *     description: Fetches a list of all cities
 *     operationId: getAllCity
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of cities
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/City'
 * 
 *   post:
 *     tags:
 *       - City
 *     summary: Create a new city
 *     description: Creates a new city and returns the created city
 *     operationId: createCity
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       description: The details of the city to create
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/City'
 *     responses:
 *       201:
 *         description: City created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/City'
 * 
 * /api/city/{id}:
 *   get:
 *     tags:
 *       - City
 *     summary: Get city by ID
 *     description: Fetches the details of a city by its ID
 *     operationId: getCityById
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the city
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: City details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/City'
 *       404:
 *         description: City not found
 * 
 *   put:
 *     tags:
 *       - City
 *     summary: Update city details
 *     description: Updates the details of an existing city
 *     operationId: updateCity
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the city
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       description: The updated details of the city
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/City'
 *     responses:
 *       200:
 *         description: City updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/City'
 * 
 *   delete:
 *     tags:
 *       - City
 *     summary: Delete a city
 *     description: Deletes a city by ID
 *     operationId: deleteCity
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the city to delete
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       204:
 *         description: City deleted successfully
 */

const getAllCity = async (ctx: KoaContext<GetAllCityResponse>) => {
  const city = await cityService.getAll();
  ctx.body = {
    items: city,
  };
};

getAllCity.validationScheme = null;

const createCity = async (ctx: KoaContext<CreateCityResponse, void, CreateCityRequest>) => {
  const newCity = await cityService.create(
    ctx.request.body,
  );
  ctx.status = 201;
  ctx.body = newCity;
};

createCity.validationScheme = {
  body: z.object({
    id: z.coerce.number().int().positive().optional(),
    postalCode: z.coerce.number().int().positive().optional(),
    name: z.string().optional(),
  }),
};

const getCityById = async (ctx: KoaContext<GetCityByIdResponse, IdParams>) => {
  const city= await cityService.getById((ctx.params.id));
  ctx.body=city;
};

getCityById.validationScheme = {
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
};

const updateCity = async (ctx: KoaContext<UpdateCityResponse, IdParams, UpdateCityRequest>) => {
  ctx.body = await cityService.updateById((ctx.params.id), ctx.request.body,
  );
};

updateCity.validationScheme = {
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
  body: z.object({
    id: z.coerce.number().int().positive().optional(),
    postalCode: z.coerce.number().int().positive().optional(),
    name: z.string().optional(),
  }),
};

const deleteCity = async (ctx: KoaContext<void, IdParams>) => {
  await cityService.deleteById((ctx.params.id));
  ctx.status = 204;
};

deleteCity.validationScheme = {
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
};

export default (parent: KoaRouter) => {
  const router = new Router<EVAppState, EVAppContext>({
    prefix: '/city',
  });
  
  const requireAdmin = makeRequireRole(Role.ADMIN);
  
  router.get('/', requireAuthentication, validate(getAllCity.validationScheme), getAllCity);
  router.post('/', requireAuthentication, validate(createCity.validationScheme), createCity);
  router.get('/:id', requireAuthentication, validate(getCityById.validationScheme), getCityById);
  router.put('/:id', requireAuthentication,requireAdmin, validate(updateCity.validationScheme), updateCity);
  router.delete('/:id', requireAuthentication,requireAdmin, validate(deleteCity.validationScheme), deleteCity);

  parent.use(router.routes()).use(router.allowedMethods());
};

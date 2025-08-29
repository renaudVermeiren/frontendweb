import Router from '@koa/router';
import * as carService from '../service/car';
import type { EVAppContext, EVAppState } from '../types/koa';
import type { KoaContext, KoaRouter } from '../types/koa';
import type {
  CreateCarRequest,
  CreateCarResponse,
  GetAllCarsResponse,
  GetCarByIdResponse,
  UpdateCarRequest,
  UpdateCarResponse,
} from '../types/car';
import type { IdParams } from '../types/common';
import validate from '../core/validation';
import { makeRequireRole, requireAuthentication } from '../core/auth';
import { z } from 'zod';

/**
 * @swagger
 * tags:
 *   name: Car
 *   description: API endpoints for managing cars
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
 *     Car:
 *       type: object
 *       required:
 *         - id
 *         - carModel
 *         - year
 *         - numberPlate
 *         - capacity
 *       properties:
 *         id:
 *           type: integer
 *           description: The car ID
 *         carModel:
 *           type: string
 *           description: The car model
 *         year:
 *           type: integer
 *           description: The car's manufacturing year
 *         numberPlate:
 *           type: string
 *           description: The car's registration number plate
 *         capacity:
 *           type: string
 *           description: The car's seating capacity
 *       example:
 *         id: 1
 *         carModel: Tesla Model 3
 *         year: 2020
 *         numberPlate: ABC1234
 *         capacity: 5
 */

/**
 * @swagger
 * /api/cars:
 *   get:
 *     tags:
 *       - Car
 *     summary: Get all cars
 *     description: Fetches a list of all cars for the authenticated user
 *     operationId: getAllCars
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of cars
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Car'
 * 
 *   post:
 *     tags:
 *       - Car
 *     summary: Create a new car
 *     description: Creates a new car for the authenticated user
 *     operationId: createCar
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       description: The details of the car to create
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Car'
 *     responses:
 *       201:
 *         description: Car created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Car'
 * 
 * /api/cars/{id}:
 *   get:
 *     tags:
 *       - Car
 *     summary: Get car by ID
 *     description: Fetches the details of a car by its ID
 *     operationId: getCarById
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the car
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Car details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Car'
 *       404:
 *         description: Car not found
 * 
 *   put:
 *     tags:
 *       - Car
 *     summary: Update car details
 *     description: Updates the details of an existing car
 *     operationId: updateCar
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the car to update
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       description: The updated details of the car
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Car'
 *     responses:
 *       200:
 *         description: Car updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Car'
 * 
 *   delete:
 *     tags:
 *       - Car
 *     summary: Delete a car
 *     description: Deletes a car by ID
 *     operationId: deleteCar
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the car to delete
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       204:
 *         description: Car deleted successfully
 */

const getAllCars = async (ctx: KoaContext<GetAllCarsResponse>) => {
  const cars = await carService.getAll(ctx.state.session.userId, ctx.state.session.roles);
  ctx.body = {
    items: cars,
  };
};

getAllCars.validationScheme = null;

const createCar = async (ctx: KoaContext<CreateCarResponse, void, CreateCarRequest>) => {
  const newCar = await carService.create({
    ...ctx.request.body,
    user_id: ctx.state.session.userId,
  });
  ctx.status = 201;
  ctx.body = newCar;
};
createCar.validationScheme = {
  body: z.object({
    id: z.coerce.number().int().optional(),
    carModel: z.string().optional(),
    year: z.number().int().positive().optional(),
    numberPlate: z.string().optional(),
    capacity: z.string().optional(),
  }),
};

const getCarById = async (ctx: KoaContext<GetCarByIdResponse, IdParams>) => {
  const car= await carService.getCarById(ctx.params.id,ctx.state.session.userId,ctx.state.session.roles);
  ctx.body=car;
};

getCarById.validationScheme =  {
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
};

const updateCar = async (ctx: KoaContext<UpdateCarResponse, IdParams, UpdateCarRequest>) => {
  ctx.body = await carService.updateById(ctx.params.id, {
    ...ctx.request.body,
    user_id: ctx.state.session.userId,
  },
  );
};

updateCar.validationScheme = {
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
  body: z.object({
    id: z.coerce.number().int().optional(),
    carModel: z.string().optional(),
    year: z.coerce.number().int().positive().optional(),
    numberPlate: z.string().optional(),
    capacity: z.string().optional(),
  }),
};

const deleteCar = async (ctx: KoaContext<void, IdParams>) => {
  await carService.deleteById(ctx.params.id,ctx.state.session.userId);
  ctx.status = 204;
};

deleteCar.validationScheme = {
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
};
import Role from '../core/roles';
export default (parent: KoaRouter) => {
  const router = new Router<EVAppState, EVAppContext>({
    prefix: '/cars',
  });

  const requireAdmin = makeRequireRole(Role.ADMIN);

  router.get('/',requireAuthentication,validate(getAllCars.validationScheme), getAllCars);
  router.post('/',requireAuthentication,validate(createCar.validationScheme),createCar);
  router.get('/:id',requireAuthentication,validate(getCarById.validationScheme) ,getCarById);
  router.put('/:id',requireAuthentication,requireAdmin,validate(updateCar.validationScheme) , updateCar);
  router.delete('/:id',requireAuthentication,requireAdmin,validate(deleteCar.validationScheme) ,deleteCar);

  parent.use(router.routes()).use(router.allowedMethods());
};

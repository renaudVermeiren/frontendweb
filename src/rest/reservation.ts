import Router from '@koa/router';
import * as reservationService from '../service/reservation';
import type { EVAppContext, EVAppState } from '../types/koa';
import type { KoaContext, KoaRouter } from '../types/koa';
import type {
  CreateReservationRequest,
  CreateReservationResponse,
  GetAllReservationsResponse,
  GetReservationByIdResponse,
  UpdateReservationRequest,
  UpdateReservationResponse,
} from '../types/reservation';
import type { IdParams } from '../types/common';
import validate from '../core/validation';
import { requireAuthentication } from '../core/auth';
import { z } from 'zod';

/**
 * @swagger
 * tags:
 *   name: Reservations
 *   description: API endpoints for managing reservations
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
 *     Reservation:
 *       type: object
 *       required:
 *         - id
 *         - user_id
 *         - chargingStation_id
 *         - startReservation
 *         - endReservation
 *       properties:
 *         id:
 *           type: integer
 *           description: The reservation ID
 *         user_id:
 *           type: integer
 *           description: The ID of the user who made the reservation
 *         chargingStation_id:
 *           type: integer
 *           description: The ID of the charging station
 *         startReservation:
 *           type: string
 *           format: date-time
 *           description: The start time of the reservation
 *         endReservation:
 *           type: string
 *           format: date-time
 *           description: The end time of the reservation
 *       example:
 *         id: 1
 *         user_id: 123
 *         chargingStation_id: 101
 *         startReservation: "2024-12-21T08:00:00Z"
 *         endReservation: "2024-12-21T10:00:00Z"
 * 
 *     CreateReservationRequest:
 *       type: object
 *       required:
 *         - chargingStation_id
 *         - startReservation
 *         - endReservation
 *       properties:
 *         chargingStation_id:
 *           type: integer
 *         startReservation:
 *           type: string
 *           format: date-time
 *         endReservation:
 *           type: string
 *           format: date-time
 *       example:
 *         chargingStation_id: 101
 *         startReservation: "2024-12-21T08:00:00Z"
 *         endReservation: "2024-12-21T10:00:00Z"
 * 
 *     CreateReservationResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         user_id:
 *           type: integer
 *         chargingStation_id:
 *           type: integer
 *         startReservation:
 *           type: string
 *           format: date-time
 *         endReservation:
 *           type: string
 *           format: date-time
 *       example:
 *         id: 1
 *         user_id: 123
 *         chargingStation_id: 101
 *         startReservation: "2024-12-21T08:00:00Z"
 *         endReservation: "2024-12-21T10:00:00Z"
 * 
 *     UpdateReservationRequest:
 *       type: object
 *       properties:
 *         chargingStation_id:
 *           type: integer
 *         startReservation:
 *           type: string
 *           format: date-time
 *         endReservation:
 *           type: string
 *           format: date-time
 *       example:
 *         chargingStation_id: 101
 *         startReservation: "2024-12-21T09:00:00Z"
 *         endReservation: "2024-12-21T11:00:00Z"
 * 
 *     UpdateReservationResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         user_id:
 *           type: integer
 *         chargingStation_id:
 *           type: integer
 *         startReservation:
 *           type: string
 *           format: date-time
 *         endReservation:
 *           type: string
 *           format: date-time
 *       example:
 *         id: 1
 *         user_id: 123
 *         chargingStation_id: 101
 *         startReservation: "2024-12-21T09:00:00Z"
 *         endReservation: "2024-12-21T11:00:00Z"
 */

/**
 * @swagger
 * /api/reservations:
 *   get:
 *     tags:
 *       - Reservations
 *     summary: Get all reservations
 *     description: Fetches all reservations for the authenticated user
 *     operationId: getAllReservations
 *     security:
 *       - BearerAuth: []  # Require JWT token for authentication
 *     responses:
 *       200:
 *         description: A list of reservations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Reservation'
 *         example:
 *           items:
 *             - id: 1
 *               user_id: 123
 *               chargingStation_id: 101
 *               startReservation: "2024-12-21T08:00:00Z"
 *               endReservation: "2024-12-21T10:00:00Z"
 *   post:
 *     tags:
 *       - Reservations
 *     summary: Create a new reservation
 *     description: Creates a new reservation for the authenticated user
 *     operationId: createReservation
 *     security:
 *       - BearerAuth: []  # Require JWT token for authentication
 *     requestBody:
 *       description: The reservation data to create
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateReservationRequest'
 *     responses:
 *       201:
 *         description: Reservation created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateReservationResponse'
 *         example:
 *           id: 1
 *           user_id: 123
 *           chargingStation_id: 101
 *           startReservation: "2024-12-21T08:00:00Z"
 *           endReservation: "2024-12-21T10:00:00Z"
 * 
 * /api/reservations/{id}:
 *   get:
 *     tags:
 *       - Reservations
 *     summary: Get a reservation by ID
 *     description: Fetches a specific reservation by ID for the authenticated user
 *     operationId: getReservationById
 *     security:
 *       - BearerAuth: []  # Require JWT token for authentication
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the reservation to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reservation found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       404:
 *         description: Reservation not found
 *   put:
 *     tags:
 *       - Reservations
 *     summary: Update a reservation by ID
 *     description: Updates a specific reservation by ID for the authenticated user
 *     operationId: updateReservation
 *     security:
 *       - BearerAuth: []  # Require JWT token for authentication
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the reservation to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: The reservation data to update
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateReservationRequest'
 *     responses:
 *       200:
 *         description: Reservation updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateReservationResponse'
 *   delete:
 *     tags:
 *       - Reservations
 *     summary: Delete a reservation by ID
 *     description: Deletes a specific reservation by ID for the authenticated user
 *     operationId: deleteReservation
 *     security:
 *       - BearerAuth: []  # Require JWT token for authentication
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the reservation to delete
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Reservation deleted successfully
 */

const getAllReservations = async (ctx: KoaContext<GetAllReservationsResponse>) => {
  const resevations = await reservationService.getAll(ctx.state.session.userId, ctx.state.session.roles);
  ctx.body = {
    items: resevations,
  };
};

getAllReservations.validationScheme = null;

const createReservation = async (ctx: KoaContext<CreateReservationResponse, void, CreateReservationRequest>) => {
  const newReservation = await reservationService.create({
    ...ctx.request.body,
    user_id: ctx.state.session.userId,
  },
  );
  ctx.status = 201;
  ctx.body = newReservation;
};

createReservation.validationScheme = {
  body: z.object({
    chargingStation_id: z.coerce.number().int(),
    startReservation: z.string().refine(
      (val) => !isNaN(Date.parse(val)) && new Date(val) > new Date(),
      { message: 'startReservation must be a valid ISO date in the future' },
    ),
    endReservation: z.string().refine(
      (val) => !isNaN(Date.parse(val)) && new Date(val) > new Date(),
      { message: 'endReservation must be a valid ISO date in the future' },
    ),
  }),
};

const getReservationById = async (ctx: KoaContext<GetReservationByIdResponse, IdParams>) => {
  const reservation= await reservationService.getById(ctx.params.id,ctx.state.session.userId,ctx.state.session.roles);
  ctx.body=reservation;
};

getReservationById.validationScheme = {
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
};

const updateReservation = async (ctx: KoaContext<UpdateReservationResponse, IdParams, UpdateReservationRequest>) => {
  ctx.body = await reservationService.updateById((ctx.params.id), {
    ...ctx.request.body,
    user_id: ctx.state.session.userId,
  },
  );
};

updateReservation.validationScheme = {
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
  body: z.object({
    id: z.coerce.number().int().optional(),
    chargingStation_id: z.coerce.number().int(),
    startReservation: z.string().refine(
      (val) => !isNaN(Date.parse(val)) && new Date(val) > new Date(),
      { message: 'startReservation must be a future ISO date' },
    ),
    endReservation: z.string().refine(
      (val) => !isNaN(Date.parse(val)) && new Date(val) > new Date(),
      { message: 'endReservation must be a future ISO date' },
    ),
  }),
};

const deleteReservation = async (ctx: KoaContext<void, IdParams>) => {
  await reservationService.deleteById((ctx.params.id));
  ctx.status = 204;
};

deleteReservation.validationScheme = {
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
};

export default (parent: KoaRouter) => {
  const router = new Router<EVAppState, EVAppContext>({
    prefix: '/reservations',
  });

  router.get('/',requireAuthentication,validate(getAllReservations.validationScheme),getAllReservations);
  router.post('/',requireAuthentication,validate(createReservation.validationScheme), createReservation);
  router.get('/:id',requireAuthentication,validate(getReservationById.validationScheme),getReservationById);
  router.put('/:id',requireAuthentication,validate(updateReservation.validationScheme),updateReservation);
  router.delete('/:id',requireAuthentication,validate(deleteReservation.validationScheme),deleteReservation);

  parent.use(router.routes()).use(router.allowedMethods());
};

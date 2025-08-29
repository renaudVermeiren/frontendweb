import Router from '@koa/router';
import * as addressService from '../service/address';
import type { EVAppContext, EVAppState } from '../types/koa';
import type { KoaContext, KoaRouter } from '../types/koa';
import type {
  CreateAddressRequest,
  CreateAddressResponse,
  GetAllAddressResponse,
  GetAddressByIdResponse,
  UpdateAddressRequest,
  UpdateAddressResponse,
} from '../types/address';
import type { IdParams } from '../types/common';
import validation from '../core/validation';
import { makeRequireRole, requireAuthentication } from '../core/auth';
import { z } from 'zod';
import Role from '../core/roles';

/**
 * @swagger
 * tags:
 *   name: Address
 *   description: API endpoints for managing addresses
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
 *     Address:
 *       type: object
 *       required:
 *         - id
 *         - houseNumber
 *         - streetName
 *         - city_id
 *       properties:
 *         id:
 *           type: integer
 *           description: The address ID
 *         houseNumber:
 *           type: integer
 *           description: The house number of the address
 *         streetName:
 *           type: string
 *           description: The street name of the address
 *         city_id:
 *           type: integer
 *           description: The city ID for the address
 *       example:
 *         id: 1
 *         houseNumber: 123
 *         streetName: Elm Street
 *         city_id: 2
 */

/**
 * @swagger
 * /api/address:
 *   get:
 *     tags:
 *       - Address
 *     summary: Get all addresses
 *     description: Fetches a list of all addresses
 *     operationId: getAllAddress
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of addresses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Address'
 * 
 *   post:
 *     tags:
 *       - Address
 *     summary: Create a new address
 *     description: Creates a new address
 *     operationId: createAddress
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       description: The details of the address to create
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Address'
 *     responses:
 *       201:
 *         description: Address created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Address'
 * 
 * /api/address/{id}:
 *   get:
 *     tags:
 *       - Address
 *     summary: Get address by ID
 *     description: Fetches the details of an address by its ID
 *     operationId: getAddressById
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the address
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Address details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Address'
 *       404:
 *         description: Address not found
 * 
 *   put:
 *     tags:
 *       - Address
 *     summary: Update address details
 *     description: Updates the details of an existing address
 *     operationId: updateAddress
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the address to update
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       description: The updated details of the address
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Address'
 *     responses:
 *       200:
 *         description: Address updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Address'
 * 
 *   delete:
 *     tags:
 *       - Address
 *     summary: Delete an address
 *     description: Deletes an address by its ID
 *     operationId: deleteAddress
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the address to delete
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       204:
 *         description: Address deleted successfully
 */

const getAllAddress = async (ctx: KoaContext<GetAllAddressResponse>) => {
  const address = await addressService.getAll();
  ctx.body = {
    items: address,
  };
};

getAllAddress.validationScheme = null;

const createAddress = async (ctx: KoaContext<CreateAddressResponse, void, CreateAddressRequest>) => {
  const newAddress = await addressService.create(
    ctx.request.body,
  );
  ctx.status = 201;
  ctx.body = newAddress;
};

createAddress.validationScheme = {
  body: z.object({
    id: z.coerce.number().int().optional(),
    houseNumber: z.coerce.number().int().positive().optional(),
    streetName: z.string().optional(),
    city_id: z.coerce.number().int().positive(),
  }),
};

const getAddressById = async (ctx: KoaContext<GetAddressByIdResponse, IdParams>) => {
  const address= await addressService.getById((ctx.params.id));
  ctx.body=address;
};

getAddressById.validationScheme = {
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
};

const updateAddress = async (ctx: KoaContext<UpdateAddressResponse, IdParams, UpdateAddressRequest>) => {
  ctx.body = await addressService.updateById((ctx.params.id), ctx.request.body,
  );
};

updateAddress.validationScheme = {
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
  body: z.object({
    id: z.coerce.number().int().positive().optional(),
    houseNumber: z.coerce.number().int().positive().optional(),
    streetName: z.string().optional(),
    city_id: z.coerce.number().int().positive(),
  }),
};

const deleteAddress = async (ctx: KoaContext<void, IdParams>) => {
  await addressService.deleteById((ctx.params.id));
  ctx.status = 204;
};

deleteAddress.validationScheme = {
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
};

export default (parent: KoaRouter) => {
  const router = new Router<EVAppState, EVAppContext>({
    prefix: '/address',
  });

  const requireAdmin = makeRequireRole(Role.ADMIN);

  router.get('/',requireAuthentication,requireAdmin, validation(getAllAddress.validationScheme),getAllAddress);
  router.post('/',requireAuthentication, validation(createAddress.validationScheme),createAddress);
  router.get('/:id',requireAuthentication,requireAdmin,validation(getAddressById.validationScheme), getAddressById);
  router.put('/:id',requireAuthentication,requireAdmin,validation(updateAddress.validationScheme), updateAddress);
  router.delete('/:id', requireAuthentication,requireAdmin,validation(deleteAddress.validationScheme),deleteAddress);

  parent.use(router.routes()).use(router.allowedMethods());
};

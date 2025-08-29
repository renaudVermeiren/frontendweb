// src/service/cars.ts
import { prisma } from '../data';
import type { Car, CarCreateInput, CarUpdateInput } from '../types/car';
import ServiceError from '../core/serviceError'; 
import handleDBError from './_handleDBError'; 
import * as userService from './user';
import Role from '../core/roles';

const CAR_SELECT = {
  id: true,
  carModel: true,
  year: true,
  numberPlate: true,
  user: {
    select: {
      username: true,
    },
  },
  capacity: true,
};

export const getAll = async (userId: number, roles: string[]): Promise<Car[]> => {
  return prisma.car.findMany(
    {
      where: roles.includes(Role.ADMIN) ? {} : {user_id: userId},
      select: CAR_SELECT,
    });
};
// import Role from '../core/roles';
export const getCarById = async (id: number,userId: number,roles: string[]): Promise<Car> => {
  const extraFilter = roles.includes(Role.ADMIN) ? {} : {user_id: userId};
  
  const car = await prisma.car.findUnique({
    where: {
      id,
      ...extraFilter,
    },
    select: CAR_SELECT,
  });

  if (!car) {
    
    throw ServiceError.notFound('No car with this id exists');
  }

  return car;
};

export const create = async ({carModel,year,numberPlate,capacity,user_id}: CarCreateInput): Promise<Car> => {
  try{
    await userService.checkUserExists(user_id);
    return await prisma.car.create({
      data: {
        carModel,
        year,
        numberPlate,
        user_id,
        capacity,
      },
      select: CAR_SELECT,
    },
    );
  } catch (error: any){
    throw handleDBError(error);
  }
};

export const updateById = async (id: number, {carModel,year,numberPlate,capacity,user_id}: CarUpdateInput):
Promise<Car> => {
  try{
    return await prisma.car.update({
      where: {
        id,
        user_id: user_id,
      },
      data: {carModel,year,numberPlate,user_id,capacity},
      select: CAR_SELECT,
    });
  }catch (error : any){
    throw handleDBError(error);
  }
};

export const deleteById = async (id: number,userId:number): Promise<void> => {

  try{
    await prisma.car.delete({
      where: {
        id,
        user_id:userId,
      },
    });
  }catch(error: any){
    throw handleDBError(error);
  }
};

export const getCarsByUserId = async (id: number): Promise<Car[]> => {

  try{
    await userService.checkUserExists(id);
    return prisma.car.findMany({
      where:{
        user_id: id,
      },
      select: CAR_SELECT,
    });
  }catch(error: any){
    throw handleDBError(error);
  }
};
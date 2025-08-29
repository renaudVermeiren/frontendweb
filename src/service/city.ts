// src/service/city.ts
import ServiceError from '../core/serviceError';
import { prisma } from '../data';
import type { City, CityCreateInput, CityUpdateInput } from '../types/city';
import handleDBError from './_handleDBError';

const CITY_SELECT = {
  id: true,
  postalCode: true,
  name: true,
};

export const getAll = async (): Promise<City[]> => {
  return prisma.city.findMany(
    {select: CITY_SELECT,
    });
};

export const getById = async (id: number): Promise<City> => {
  const city = await prisma.city.findUnique({
    where: {
      id,
    },
    select: CITY_SELECT,
  });

  if(!city){
    throw ServiceError.notFound('No city with this id exists');
  }

  return city;
};

export const create = async (city: CityCreateInput): Promise<City> => {
  try{
    return await  prisma.city.create({
      data: city ,
      select: CITY_SELECT,
    },
    );

  }catch(error:any){
    throw handleDBError(error);
  }
};

export const updateById = async (id: number, changes: CityUpdateInput): Promise<City> => {
  try{
    return await prisma.city.update({
      where: {
        id,
      },
      data: changes,
      select: CITY_SELECT,
    });
  }catch(error:any){
    throw handleDBError(error);
  }
};

export const deleteById = async (id: number): Promise<void> => {
  await checkCityExists(id);
  await prisma.city.delete({
    where: {
      id,
    },
  });
};

export const checkCityExists = async (id: number) => {
  const city = await prisma.city.findUnique({
    where: {
      id,
    },
  });
  if(!city){
    throw ServiceError.notFound('No city with this id exists');
  }
};
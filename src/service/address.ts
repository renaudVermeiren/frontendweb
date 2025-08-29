// src/service/cars.ts
import ServiceError from '../core/serviceError';
import { prisma } from '../data';
import type { Address, AddressCreateInput, AddressUpdateInput } from '../types/address';
import handleDBError from './_handleDBError';

const ADDRESS_SELECT = {
  id: true,
  houseNumber: true,
  streetName: true,
  city: {
    select: {
      name: true,
    },
  },
};

export const getAll = async (): Promise<Address[]> => {
  return prisma.address.findMany(
    {select: ADDRESS_SELECT,
    });
};

export const getById = async (id: number): Promise<Address> => {
  const address = await prisma.address.findUnique({
    where: {
      id,
    },
    select: ADDRESS_SELECT,
  });

  if(!address){
    throw ServiceError.notFound('No addrewss with this id exists');
  }

  return address;
};

export const create = async (address: AddressCreateInput): Promise<Address> => {
  try{
    const newAddress = await prisma.address.create({
      data: address ,
      select: ADDRESS_SELECT,
    },
    );

    return newAddress;
  } catch (error : any) {
    throw handleDBError(error);

  }
};

export const updateById = async (id: number, changes: AddressUpdateInput): Promise<Address> => {
  try{
    return await prisma.address.update({
      where: {
        id,
      },
      data: changes,
      select: ADDRESS_SELECT,
    });
  }catch(error :any) {
    throw handleDBError(error);
  }
};

export const deleteById = async (id: number): Promise<void> => {
  await prisma.address.delete({
    where: {
      id,
    },
  });
};
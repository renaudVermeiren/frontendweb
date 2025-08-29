// src/service/chargingStation.ts
import ServiceError from '../core/serviceError';
import { prisma } from '../data';
import type { ChargingStation, ChargingStationCreateInput, ChargingStationUpdateInput } from '../types/chargingStation';

const CHARGING_STATION_SELECT = {
  id: true,
  address_id: true,
  numberOfSpaces: true,
};

export const getAll = async (): Promise<ChargingStation[]> => {
  return prisma.chargingStation.findMany(
    {select: CHARGING_STATION_SELECT,
    });
};

export const getById = async (id: number): Promise<ChargingStation> => {
  const chargingStation = await prisma.chargingStation.findUnique({
    where: {
      id,
    },
    select: CHARGING_STATION_SELECT,
  });

  if(!chargingStation){
    throw ServiceError.notFound('No chargingStation with this id exists');
  }

  return chargingStation;
};

export const create = async (chargingStation: ChargingStationCreateInput): Promise<ChargingStation> => {
  const newChargingStation =  prisma.chargingStation.create({
    data: chargingStation ,
    select: CHARGING_STATION_SELECT,
  },
  );

  return newChargingStation;
};

export const updateById = async (id: number, changes: ChargingStationUpdateInput): Promise<ChargingStation> => {
  return prisma.chargingStation.update({
    where: {
      id,
    },
    data: changes,
    select: CHARGING_STATION_SELECT,
  });
};

export const deleteById = async (id: number): Promise<void> => {
  await prisma.chargingStation.delete({
    where: {
      id,
    },
  });
};

export const checkChargingStationExists = async (id: any) => {

  const chargingstation = await prisma.chargingStation.findUnique({
    where: {
      id,
    },
  });

  if (!chargingstation) {
    // 👇 2
    throw ServiceError.notFound('No chargingstation with this id exists');
  }
};
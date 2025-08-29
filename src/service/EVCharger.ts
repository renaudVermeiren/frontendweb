// src/service/EVCharger.ts
import ServiceError from '../core/serviceError';
import { prisma } from '../data';
import type { EVCharger, EVChargerCreateInput, EVChargerUpdateInput } from '../types/EVCharger';
import handleDBError from './_handleDBError';
import { checkChargingStationExists } from './chargingStation';

const EVCHARGER_SELECT = {
  id: true,
  chargingStation_id:true,
  name: true,
  connectorType: true,
  chargeTime: true,
  rangePerHour:true,
  userCase:true,
};

export const getAll = async (): Promise<EVCharger[]> => {
  return prisma.eVCharger.findMany(
    {select: EVCHARGER_SELECT,
    });
};

export const getById = async (id: number): Promise<EVCharger> => {
  const EVCharger = await prisma.eVCharger.findUnique({
    where: {
      id,
    },
    select: EVCHARGER_SELECT,
  });

  if(!EVCharger){
    throw ServiceError.notFound('No EVCharger with this id exists');
  }

  return EVCharger;
};

export const create = async (EVCharger: EVChargerCreateInput): Promise<EVCharger> => {
  try{
    await checkChargingStationExists(EVCharger.chargingStation_id);
    return await prisma.eVCharger.create({
      data: EVCharger,
      select: EVCHARGER_SELECT,
    },
    );
  }catch(error:any){
    throw handleDBError(error);
  }
};

export const updateById = async (id: number, changes: EVChargerUpdateInput): Promise<EVCharger> => {
  try{
    return await prisma.eVCharger.update({
      where: {
        id,
      },
      data: changes,
      select: EVCHARGER_SELECT,
    });
  }catch(error:any){
    throw handleDBError(error);
  }
};

export const deleteById = async (id: number): Promise<void> => {
  try{
    await prisma.eVCharger.delete({
      where: {
        id,
      },
    });
  }catch(error:any){
    throw handleDBError(error);
  }
};

export const getEVChargersByChargingStationId = async (id: number): Promise<EVCharger[]> => {
  return prisma.eVCharger.findMany({
    where:{
      chargingStation_id: id,
    },
    select: EVCHARGER_SELECT,
  });
};
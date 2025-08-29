// src/service/reservation.ts
import ServiceError from '../core/serviceError';
import { prisma } from '../data';
import type {Reservation, ReservationCreateInput, ReservationUpdateInput } from '../types/reservation';
import handleDBError from './_handleDBError';

const RESERVATION_SELECT = {
  id: true,
  chargingStation_id:true,
  user: {
    select: {
      username: true,
    },
  },
  startReservation: true,
  endReservation: true,
};

export const getAll = async (userId: number, roles: string[]): Promise<Reservation[]> => {
  return prisma.reservations.findMany(
    {select: RESERVATION_SELECT,
      where:roles.includes(Role.ADMIN) ? {} : {user_id: userId},
    });
};
import Role from '../core/roles';
export const getById = async (id: number,userId: number,roles: string[]): Promise<Reservation> => {
  const extraFilter = roles.includes(Role.ADMIN) ? {} : {user_id: userId};
  const reservation = await prisma.reservations.findUnique({
    where: {
      id,
      ...extraFilter,
    },
    select: RESERVATION_SELECT,
  });

  if(!reservation){
    throw ServiceError.notFound('No reservation with this id exists');
  }

  return reservation;
};

export const create = async ({chargingStation_id,startReservation,endReservation,user_id}:
ReservationCreateInput): Promise<Reservation> => {
  const existingUser = await prisma.user.findUnique({
    where:{
      id: user_id,
    },
  });

  if (!existingUser) {
    throw ServiceError.notFound(`There is no user with id ${user_id}.`);
  }

  const existingchargingStation = await prisma.chargingStation.findUnique({
    where: {
      id: chargingStation_id,
    },
  });

  if(!existingchargingStation){
    throw ServiceError.notFound(`There is no chargingStation with id ${chargingStation_id}.`);
  }

  if(existingchargingStation.numberOfSpaces!==null){

    const numberOfExistingReservations = await prisma.reservations.count({
      where: {
        chargingStation_id: chargingStation_id,
        startReservation:{
          lte: endReservation,
        },
        endReservation:{
          gte: startReservation,
        },
      },
    });

    if(numberOfExistingReservations >= existingchargingStation.numberOfSpaces){
      throw  ServiceError.forbidden('No available spaces for this reservation');
    }
  }

  try{
    const newReservation =  prisma.reservations.create({
      data:{
        chargingStation_id: chargingStation_id,
        user_id: user_id,
        startReservation: startReservation,
        endReservation: endReservation,
      } ,
      select: RESERVATION_SELECT,
    },
    );

    return newReservation;
  }catch(error:any){
    throw handleDBError(error);
  }
};

export const updateById = async (id: number, {chargingStation_id,startReservation,endReservation,user_id}:
ReservationUpdateInput): Promise<Reservation> => {

  const existingUser = await prisma.user.findUnique({
    where:{
      id: user_id,
    },
  });
    
  if (!existingUser) {
    throw ServiceError.notFound(`There is no user with id ${user_id}.`);
  }
    
  const existingchargingStation = await prisma.chargingStation.findUnique({
    where: {
      id: chargingStation_id,
    },
  });
    
  if(!existingchargingStation){
    throw ServiceError.notFound(`There is no chargingStation with id ${chargingStation_id}.`);
  }

  return prisma.reservations.update({
    where: {
      id,
    },
    data: {chargingStation_id,user_id,startReservation,endReservation},
    select: RESERVATION_SELECT,
  });
};

export const deleteById = async (id: number): Promise<void> => {
  await prisma.reservations.delete({
    where: {
      id,
    },
  });
};

export const getReservationsByUserId = async (id: number): Promise<Reservation[]> => {
  return prisma.reservations.findMany({
    where:{
      user_id: id,
    },
    select: RESERVATION_SELECT,
  });
};
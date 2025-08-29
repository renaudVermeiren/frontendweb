// src/service/FavChargStation.ts
import ServiceError from '../core/serviceError';
import { prisma } from '../data';
import type { FavChargStation, FavChargStationCreateInput, FavChargStationUpdateInput } from '../types/favChargStation';
import handleDBError from './_handleDBError';
import { checkChargingStationExists } from './chargingStation';
import { checkUserExists } from './user';
import Role from '../core/roles';

export const getAll = async (userId: number, roles: string[]): Promise<FavChargStation[]> => {
  const result = await prisma.favoriteChargingStation.findMany(
    {
      where: roles.includes(Role.ADMIN) ? {} : {user_id: userId},

      include: {
        user: {
          select: {
            username: true,
          },
        },
        chargingStation: {
          include: {
            address: {
              select: {
                streetName: true,
                houseNumber: true,
              },
            },
          },
        },
      },
    });
    
  return result.map((fav) => ({
    id: fav.id,
    user_id: fav.user_id,
    chargingStation_id: fav.chargingStation_id,
    username: { username: fav.user?.username ?? '' },
    address: {
      streetName: fav.chargingStation?.address?.streetName ?? null,
      houseNumber: fav.chargingStation?.address?.houseNumber ?? null,
    },
  }));
};

export const getById = async (id: number,userId: number,roles: string[]): Promise<FavChargStation> => {
  const extraFilter = roles.includes(Role.ADMIN) ? {} : {user_id: userId};
  const station = await prisma.favoriteChargingStation.findUnique({
    where: {
      id,
      ...extraFilter,
    },
    include: {
      user: {
        select: {
          username: true,
        },
      },
      chargingStation: {
        include: {
          address: {
            select: {
              streetName: true,
              houseNumber: true,
            },
          },
        },
      },
    },
  });

  if(!station){
    throw ServiceError.notFound('No station with this id exists');
  }

  return {
    id: station.id,
    user_id: station.user_id,
    chargingStation_id: station.chargingStation_id,
    username: { username: station.user?.username ?? '' }, // Map username, fallback to empty string
    address: {
      streetName: station.chargingStation?.address?.streetName ?? null,
      houseNumber: station.chargingStation?.address?.houseNumber ?? null,
    },
  };
};

export const create = async ({user_id,chargingStation_id}: FavChargStationCreateInput): Promise<FavChargStation> => {
  try{
    await checkUserExists(user_id);

    await checkChargingStationExists(chargingStation_id);

    const station = await prisma.favoriteChargingStation.create({
      data: {user_id,chargingStation_id},
      include: {
        user: {
          select: {
            username: true,
          },
        },
        chargingStation: {
          include: {
            address: {
              select: {
                streetName: true,
                houseNumber: true,
              },
            },
          },
        },
      },
    },
    );

    return {
      id: station.id,
      user_id: station.user_id,
      chargingStation_id: station.chargingStation_id,
      username: { username: station.user?.username ?? '' }, // Map username, fallback to empty string
      address: {
        streetName: station.chargingStation?.address?.streetName ?? null,
        houseNumber: station.chargingStation?.address?.houseNumber ?? null,
      },
    };
  } catch (error : any){
    throw handleDBError(error);
  }
};

export const updateById = async (id: number, {chargingStation_id,user_id}: FavChargStationUpdateInput): 
Promise<FavChargStation> => {
  const existingStation = await prisma.chargingStation.findUnique({
    where:{
      id: chargingStation_id,
    },
  });
      
  if (!existingStation) {
    throw ServiceError.notFound(`There is no user with id ${chargingStation_id}.`);
  }

  const station = await prisma.favoriteChargingStation.update({
    where: {
      id,
    },
    data: {user_id,chargingStation_id},
    include: {
      user: {
        select: {
          username: true,
        },
      },
      chargingStation: {
        include: {
          address: {
            select: {
              streetName: true,
              houseNumber: true,
            },
          },
        },
      },
    },
  });

  return {
    id: station.id,
    user_id: station.user_id,
    chargingStation_id: station.chargingStation_id,
    username: { username: station.user?.username ?? '' }, // Map username, fallback to empty string
    address: {
      streetName: station.chargingStation?.address?.streetName ?? null,
      houseNumber: station.chargingStation?.address?.houseNumber ?? null,
    },
  };
};

export const deleteById = async (id: number,station: number): Promise<void> => {
  await prisma.favoriteChargingStation.deleteMany({
    where: {
      chargingStation_id:station,
      user_id: id,
    },
  });
};

export const getFavsByUserId = async (id: number): Promise<FavChargStation[]> => {
  const station = await prisma.favoriteChargingStation.findMany({
    where:{
      user_id: id,
    },
    include: {
      user: {
        select: {
          username: true,
        },
      },
      chargingStation: {
        include: {
          address: {
            select: {
              streetName: true,
              houseNumber: true,
            },
          },
        },
      },
    },
  });
  return station.map((fav) => ({
    id: fav.id,
    user_id: fav.user_id,
    chargingStation_id: fav.chargingStation_id,
    username: { username: fav.user?.username ?? '' },
    address: {
      streetName: fav.chargingStation?.address?.streetName ?? null,
      houseNumber: fav.chargingStation?.address?.houseNumber ?? null,
    },
  }));
};


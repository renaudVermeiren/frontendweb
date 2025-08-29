// src/service/user.ts
import ServiceError from '../core/serviceError';
import { prisma } from '../data';
import type{ UserUpdateInput, PublicUser, RegisterUserRequest } from '../types/user';
import handleDBError from './_handleDBError';
import Role from '../core/roles';
import { hashPassword, verifyPassword } from '../core/password'; 
import jwt from 'jsonwebtoken'; // 👈 9
import { getLogger } from '../core/logging'; // 👈 4
import { generateJWT, verifyJWT } from '../core/jwt'; // 👈 5
import type { SessionInfo } from '../types/auth'; // 👈 1

const USER_SELECT = {
  id: true,
  username: true,
  email: true,
  address: {
    select: {
      houseNumber: true,
      streetName: true,
      city:{
        select: {
          name: true,
        },
      },
    },
  },
};

export const getAll = async (): Promise<PublicUser[]> => {
  return prisma.user.findMany(
    {select: USER_SELECT,
    });
};

export const getById = async (id: number): Promise<PublicUser> => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    select: USER_SELECT,
  });

  if(!user){
    throw ServiceError.notFound('No user with this id exists');
  }

  return user;
};

export const register = async ({  username, email, password}: RegisterUserRequest): Promise<string> => {
  try{
    const passwordHash = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password_hash: passwordHash,
        roles: JSON.stringify([Role.USER]),
      },
      
    },
    );
    
    if(!newUser){
      throw ServiceError.internalServerError(  'An unexpected error occured when creating the user');
    }

    return await generateJWT(newUser);
  }catch(error : any){
    throw handleDBError(error);
  }
};

export const updateById = async (id: number, changes: UserUpdateInput): Promise<PublicUser> => {
  return prisma.user.update({
    where: {
      id,
    },
    data: changes,
    select: USER_SELECT,
  });
};

export const deleteById = async (id: number): Promise<void> => {
  await prisma.user.delete({
    where: {
      id:id,
    },
  });
};

export const checkUserExists = async (id: number) => {

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    
    throw ServiceError.notFound('No User with this id exists');
  }
};
export const login = async (
  email: string,
  password: string,
): Promise<string> => {
  const user = await prisma.user.findUnique({ 
    where: { 
      email,
    }, select : {
      id: true,
      username: true,
      email: true,
      roles: true,
      password_hash: true,
    },
  }); 

  if (!user) {
    // DO NOT expose we don't know the user
    throw ServiceError.unauthorized(
      'The given email and password do not match',
    );
  }

  const passwordValid = await verifyPassword(password, user.password_hash);

  if (!passwordValid) {
    // DO NOT expose we know the user but an invalid password was given
    throw ServiceError.unauthorized(
      'The given email and password do not match',
    );
  }
  return await generateJWT(user); 
};

export const checkAndParseSession = async (
  authHeader?: string,
): Promise<SessionInfo> => {

  if (!authHeader) {
    throw ServiceError.unauthorized('You need to be signed in');
  }

  if (!authHeader.startsWith('Bearer ')) {
    throw ServiceError.unauthorized('Invalid authentication token');
  }

  const authToken = authHeader.substring(7);

  try {
    const { roles, sub } = await verifyJWT(authToken);
   
    return {
      userId: Number(sub),
      roles,
    };
  } catch (error: any) {
 
    getLogger().error(error.message, { error });
    
    if (error instanceof jwt.TokenExpiredError) {
      throw ServiceError.unauthorized('The token has expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw ServiceError.unauthorized(
        `Invalid authentication token: ${error.message}`,
      );
    } else {
      throw ServiceError.unauthorized(error.message);
    }
  }
};

export const checkRole = (role: string, roles: string[]): void => {
  const hasPermission = roles.includes(role); // 👈 1

  // 👇 2
  if (!hasPermission) {
    throw ServiceError.forbidden(
      'You are not allowed to view this part of the application',
    );
  }
};
// src/core/jwt.ts
import config from 'config'; // 👈 1
import type {
  JwtPayload,
  Secret,
  SignOptions,
  VerifyOptions,
} from 'jsonwebtoken'; // 👈 2
import jwt from 'jsonwebtoken'; // 👈 2
import util from 'node:util'; // 👈 3
import type { registerUser } from '../types/user';

// 👇 1
const JWT_AUDIENCE = config.get<string>('auth.jwt.audience');
const JWT_SECRET = config.get<string>('auth.jwt.secret');
const JWT_ISSUER = config.get<string>('auth.jwt.issuer');
const JWT_EXPIRATION_INTERVAL = config.get<number>(
  'auth.jwt.expirationInterval',
);

// 👇 4
const asyncJwtSign = util.promisify<JwtPayload, Secret, SignOptions, string>(
  jwt.sign,
);
const asyncJwtVerify = util.promisify<
  string,
  Secret,
  VerifyOptions,
  JwtPayload
>(jwt.verify);

// 👇 5
export const generateJWT = async (user: registerUser): Promise<string> => {
  const tokenData = { roles: user.roles }; // 👈 6

  // 👇 7
  const signOptions = {
    expiresIn: Math.floor(JWT_EXPIRATION_INTERVAL),
    audience: JWT_AUDIENCE,
    issuer: JWT_ISSUER,
    subject: `${user.id}`,
  };

  // 👇 8
  return asyncJwtSign(tokenData, JWT_SECRET, signOptions);
};

// 👇 9
export const verifyJWT = async (authToken: string): Promise<JwtPayload> => {
  // 👇 10
  const verifyOptions = {
    audience: JWT_AUDIENCE,
    issuer: JWT_ISSUER,
  };

  // 👇 11
  return asyncJwtVerify(authToken, JWT_SECRET, verifyOptions);
};

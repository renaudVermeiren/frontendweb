export default {
  cors: {
    origins: ['https://frontendweb-2425-renaudvermeiren.onrender.com'],
  },
  auth: {
    jwt: {
      expirationInterval: 7 * 24 * 60 * 60, // s (7 days)
    },
    argon: {
      hashLength: 32,
      timeCost: 6,
      memoryCost: 2 ** 17,
    },
  },
};
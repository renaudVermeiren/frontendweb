export default {
  auth: {
    jwt: {
      expirationInterval: 60 * 60, // s (1 hour)
      secret: 'eenveeltemoeilijksecretdatniemandooitzalradenandersisdesitegehackedNummer2',
    },
    argon: {
      hashLength: 32,
      timeCost: 6,
      memoryCost: 2 ** 17,
    },
  },
};
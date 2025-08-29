import withServer from '../helpers/withServer'; // 👈 2
import { login } from '../helpers/login'; // 👈 3
import testAuthHeader from '../helpers/testAuthHeader'; // 👈 5
import type supertest from 'supertest';
// import type { Server } from 'http';
import { prisma } from '../../src/data';

const data = {
  cars: [
    {
      id: 188,
      carModel:'tesla',
      year: 2015,
      numberPlate: 'XYZ-123',
      user_id: 1,
      capacity: '4 stoelen',
    },
    {
      id: 288,
      carModel:'tesla2',
      year: 2015,
      numberPlate: '2XYZ-123',
      user_id: 1,
      capacity: '4 stoelen2',
    },
    {
      id: 388,
      carModel:'tesla3',
      year: 2015,
      numberPlate: '3XYZ-123',
      user_id: 1,
      capacity: '4 stoelen3',
    },
  ],
  address: [
    {
      id: 101,
      houseNumber: 21,
      streetName:'Voskenslaan',
      city_id: 1,
    },
  ],
  cities: [{
    id: 1,
    postalCode: 9000,
    name: 'Gent',
  }],
};

const dataToDelete = {
  cars: [188, 288, 388],
  address: [101],
  cities: [1],
};

describe('Users', () =>{
  // let server: Server;
  let request: supertest.Agent;
  let authHeader: string;

  withServer((r) => (request = r));

  beforeAll(async () => {
    authHeader = await login(request);
    
  });

  const url = '/api/users'; 

  describe('GET /api/users',()=> {
    beforeAll(async ()=> {
      await prisma.city.createMany({data:data.cities});
      await prisma.address.createMany({ data: data.address });
      await prisma.car.createMany({ data: data.cars });
        
    });

    afterAll(async () => {
             
      await prisma.car.deleteMany({
        where: { id: { in: dataToDelete.cars } },
      });
      
      await prisma.address.deleteMany({
        where: { id: { in: dataToDelete.address } },
      });
      await prisma.city.deleteMany({
        where : {id: { in :dataToDelete.cities}},
      });
    });

    it('should 200 and return the loged in user',async () => {
      const response = await request.get(url+'/me').set('Authorization', authHeader);
      expect(response.status).toBe(200);
    
      expect(response.body).toEqual(
        {
          'id': 1,
          'username': 'Test User',
          'email': 'test.user@hogent.be',
          'address': null,
        },
      );
    });
  });

  testAuthHeader(() => request.get(url));

  describe('GET /api/users', () => {
  
    beforeAll(async () => {
      await prisma.city.createMany({data: data.cities});
      await prisma.address.createMany({data: data.address});
      await prisma.car.createMany({ data: data.cars });
    
    });

    afterAll(async () => {
             
      await prisma.car.deleteMany({
        where: { id: { in: dataToDelete.cars } },
      });
      
      await prisma.address.deleteMany({
        where: { id: { in: dataToDelete.address } },
      });
      await prisma.city.deleteMany({
        where : {id: { in :dataToDelete.cities}},
      });
    });

    it('should 200 and return all cars of the user',async () => {
      const response = await request.get(url+'/me/cars').set('Authorization', authHeader);
      expect(response.status).toBe(200);

      expect(response.body.items).toEqual(
        expect.arrayContaining([
          {
            capacity: '4 stoelen', 
            carModel: 'tesla',
            id: 188, 
            numberPlate: 'XYZ-123', 
            user: {'username': 'Test User'},
            year: 2015},

          {
            capacity: '4 stoelen2',
            carModel: 'tesla2',
            id: 288, 
            numberPlate: '2XYZ-123', 
            user: {'username': 'Test User'}, 
            year: 2015},
          {capacity: '4 stoelen3', 
            carModel: 'tesla3',
            id: 388, 
            numberPlate: '3XYZ-123', 
            user: {'username': 'Test User'}, 'year': 2015,
          },
        ],
        ),
      );
      
    },
    );
  });

  describe('GET /api/users/me/favoriteChargingStations', () => {
    const favStations = [
      { id: 501, user_id: 1, chargingStation_id: 1001 },
      { id: 502, user_id: 1, chargingStation_id: 1002 },
    ];

    const chargingStations = [
      { id: 1001, address_id: 101 },
      { id: 1002, address_id: 101 },
    ];

    beforeAll(async () => {
    // Zorg dat afhankelijkheden eerst bestaan
      await prisma.city.createMany({ data: data.cities });
      await prisma.address.createMany({ data: data.address });
      await prisma.chargingStation.createMany({ data: chargingStations });
      await prisma.favoriteChargingStation.createMany({ data: favStations });
    });

    afterAll(async () => {
      await prisma.favoriteChargingStation.deleteMany({
        where: { id: { in: favStations.map((f) => f.id) } },
      });
      await prisma.chargingStation.deleteMany({
        where: { id: { in: chargingStations.map((c) => c.id) } },
      });
      await prisma.address.deleteMany({
        where: { id: { in: dataToDelete.address } },
      });
      await prisma.city.deleteMany({
        where: { id: { in: dataToDelete.cities } },
      });
    });

    it('should 200 and return all favorite charging stations of the user', async () => {
      const response = await request
        .get('/api/users/me/favoriteChargingStations')
        .set('Authorization', authHeader);

      expect(response.status).toBe(200);
      expect(response.body.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: 501,
          }),
          expect.objectContaining({
            id: 502,
          }),
        ]),
      );
    });
  });

  describe('GET /api/users/me/reservations', () => {
    const reservations = [
      { id: 701, user_id: 1, chargingStation_id: 1001, startReservation: new Date('2025-01-01T10:00:00Z'), 
        endReservation: new Date('2025-01-01T12:00:00Z') },
      { id: 702, user_id: 1, chargingStation_id: 1002, startReservation: new Date('2025-01-02T14:00:00Z'), 
        endReservation: new Date('2025-01-02T16:00:00Z') },
    ];

    const chargingStations = [
      { id: 1001, address_id: 101 },
      { id: 1002, address_id: 101 },
    ];

    beforeAll(async () => {
    // Zorg dat afhankelijkheden eerst bestaan
      await prisma.city.createMany({ data: data.cities });
      await prisma.address.createMany({ data: data.address });
      await prisma.chargingStation.createMany({ data: chargingStations });
      await prisma.reservations.createMany({ data: reservations });
    });

    afterAll(async () => {
      await prisma.reservations.deleteMany({
        where: { id: { in: reservations.map((r) => r.id) } },
      });
      await prisma.chargingStation.deleteMany({
        where: { id: { in: chargingStations.map((c) => c.id) } },
      });
      await prisma.address.deleteMany({
        where: { id: { in: dataToDelete.address } },
      });
      await prisma.city.deleteMany({
        where: { id: { in: dataToDelete.cities } },
      });
    });

    it('should 200 and return all reservations of the user', async () => {
      const response = await request
        .get('/api/users/me/reservations')
        .set('Authorization', authHeader);

      expect(response.status).toBe(200);
      expect(response.body.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: 701,
          }),
          expect.objectContaining({
            id: 702,
          }),
        ]),
      );
    });
  });
  
});


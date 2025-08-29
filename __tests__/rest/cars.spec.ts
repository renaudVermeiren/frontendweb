import type supertest from 'supertest'; 
import { prisma } from '../../src/data'; 
import withServer from '../helpers/withServer';
import { login } from '../helpers/login';

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
    },
  ],
};

const dataToDelete = {
  cars: [188, 288, 388],
  address: [101],
};

describe('Cars', () => {

  let request: supertest.Agent;
  let authHeader: string;
  // let adminAuthHeader: string;
 
  withServer((r)=> (request=r));

  beforeAll(async () => {
    authHeader = await login(request);
    // adminAuthHeader = await loginAdmin(request);
  });

  const url = '/api/cars'; 

  describe('GET /api/cars',()=> {
    beforeAll(async ()=> {
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
    });

    it('should 200 and return all cars', async () => {
      const response = await request.get(url).set('Authorization',authHeader);
      expect(response.status).toBe(200);
      expect(response.body.items.length).toBe(3);

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

    });
  });

  describe('POST /api/cars', () => {
    const carsToDelete: number[] = []; 
   
    beforeAll(async () => {
      
    });
  
    afterAll(async () => {
    
      await prisma.car.deleteMany({
        where: { id: { in: carsToDelete } },
      });
    
      await prisma.address.deleteMany({
        where: { id: { in: dataToDelete.address } },
      });

    });

    it('should 201 and return the created car', async () => {
     
      const response = await request.post(url).send({
        carModel:'toyota',
        year:2003,
        numberPlate:'FZ23',
        capacity:'4 stoelen',
      }).set('Authorization',authHeader);
      
      expect(response.status).toBe(201); 
      expect(response.body.id).toBeTruthy(); 
      expect(response.body.carModel).toBe('toyota');
      expect(response.body.year).toBe(2003);
      expect(response.body.numberPlate).toBe('FZ23');
      expect(response.body.capacity).toBe('4 stoelen');
      expect(response.body.user).toEqual({
        username: 'Test User',
      });

      carsToDelete.push(response.body.id);
    });
  });
},
);
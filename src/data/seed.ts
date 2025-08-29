import { PrismaClient } from '@prisma/client'; 
import { hashPassword } from '../core/password';
import Role from '../core/roles';

const prisma = new PrismaClient(); // 👈 1

// 👇 2
async function main() {

  await prisma.car.deleteMany();
  await prisma.eVCharger.deleteMany();
  await prisma.reservations.deleteMany();
  await prisma.favoriteChargingStation.deleteMany();
  await prisma.user.deleteMany();
  await prisma.chargingStation.deleteMany();
  await prisma.address.deleteMany();
  await prisma.city.deleteMany();
  // Seed city
  // ==========
  
  await prisma.city.createMany({
    data: [
      {
        id: 1,
        postalCode: 9000,
        name: 'Gent',
      },
      {
        id: 2,
        postalCode: 9400,
        name: 'Ninove',
      },
      {
        id: 3,
        postalCode: 9402,
        name: 'Meerbeke',
      },
    ],
  });

  // Seed adress
  // ===========
  await prisma.address.createMany({
    data: [
      {
        id: 1,
        houseNumber: 21,
        streetName: 'Nellekensstraat',
        city_id: 3,
      },
      {
        id: 2,
        houseNumber: 278,
        streetName: 'Voskenslaan',
        city_id: 1,
      },
      {
        id: 3,
        houseNumber: 81,
        streetName: 'Astridlaan',
        city_id: 2,
      },
    ],
  });

  // Seed transactions
  // =================

  const passwordHash = await hashPassword('12345678');
  await prisma.user.createMany({
    data: [
   
      {
        id: 1,
        username: 'Renaud Vermeiren',
        homeAddress_id:2,
        email: 'renaud.vermeiren@student.hogent.be',
        password_hash: passwordHash,
        roles: JSON.stringify([Role.ADMIN,Role.USER]),

      },
      {
        id: 2,
        username: 'Nathan Vermeiren',
        homeAddress_id:2,
        email: 'nathan@vermeiren.org',
        password_hash: passwordHash,
        roles: JSON.stringify([Role.USER]),
      },
      {
        id: 3,
        username: 'Renaud Vermeiren',
        homeAddress_id:3,
        email: 'renaud@vermeiren.org',
        password_hash: passwordHash,
        roles: JSON.stringify([Role.USER]),
      },
    ],
  });

  await prisma.car.createMany({
    data: [
      {
        carModel: 'Toyota Corolla',
        year: 2018,
        numberPlate: 'ABC-123',
        user_id: 1,
        capacity: '5-seater',
      },
      {
        carModel: 'Honda Civic',
        year: 2020,
        numberPlate: 'XYZ-789',
        user_id: 2,
        capacity: '5-seater',
      },
      {
        carModel: 'Ford F-150',
        year: 2019,
        numberPlate: 'JKL-456',
        user_id: 3,
        capacity: '6-seater',
      },
      {
        carModel: 'Tesla Model 3',
        year: 2021,
        numberPlate: 'TES-001',
        user_id: 1,
        capacity: '5-seater',
      },
      {
        carModel: 'Volkswagen Golf',
        year: 2017,
        numberPlate: 'GHI-789',
        user_id: 2,
        capacity: '5-seater',
      },
    ],
  });

  const chargingStation1 = await prisma.chargingStation.create({
    data: {
      address_id: 1,
      numberOfSpaces: 5,
    },
  });

  const chargingStation2 = await prisma.chargingStation.create({
    data: {
      address_id: 2,
      numberOfSpaces: 3,
    },
  });

  // Insert mock EV chargers for each charging station
  await prisma.eVCharger.create({
    data: {
      chargingStation_id: chargingStation1.id,
      name: 'Level 1 Charger',
      connectorType: 'Type 2',
      chargeTime: 120, // in minutes
      rangePerHour: '60 km',
      userCase: 'Residential',
    },
  });

  await prisma.eVCharger.create({
    data: {
      chargingStation_id: chargingStation2.id,
      name: 'Level 1 Charger',
      connectorType: 'Type 2',
      chargeTime: 100, // in minutes
      rangePerHour: '55 km',
      userCase: 'Public',
    },
  });

  await prisma.reservations.create({
    data: {
      chargingStation_id: chargingStation1.id,
      user_id: 1,
      startReservation: new Date('2024-12-19T10:00:00'),
      endReservation: new Date('2024-12-19T12:00:00'),
    },
  });

  await prisma.reservations.create({
    data: {
      chargingStation_id: chargingStation1.id,
      user_id: 2,
      startReservation: new Date('2024-12-19T12:30:00'),
      endReservation: new Date('2024-12-19T14:00:00'),
    },
  });

  await prisma.reservations.create({
    data: {
      chargingStation_id: chargingStation2.id,
      user_id: 3,
      startReservation: new Date('2024-12-19T08:00:00'),
      endReservation: new Date('2024-12-19T10:00:00'),
    },
  });
  
  await prisma.favoriteChargingStation.create({
    data: {
      user_id: 1,
      chargingStation_id: chargingStation1.id,
    },
  });

  await prisma.favoriteChargingStation.create({
    data: {
      user_id: 2,
      chargingStation_id: chargingStation2.id,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

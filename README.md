#  Web Services

-  Renaud Vermeiren
- E-mailadres: <renaud@vermeiren.org>
- Applicatie is online te vinden op deze link: (https://frontendweb-2425-renaudvermeiren.onrender.com)

# Requirements

- [NodeJS v17 or higher](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/)
- [MySQL v8](https://dev.mysql.com/downloads/windows/installer/8.0.html) 
- [MySQL Workbench](https://dev.mysql.com/downloads/workbench/) 

## Opstarten
Create a `.env` (development) or `.env.test` (testing) file with the following template.
Complete the environment variables with your secrets, credentials, etc.

```bash
NODE_ENV=development
DATABASE_URL=mysql://<USERNAME>:<PASSWORD>@localhost:3306/<DATABASE_NAME>
AUTH_JWT_SECRET=<YOUR-JWT-SECRET>
```

### Development

- Enable Corepack: `corepack enable`
- Install all dependencies: `yarn install`
- Make sure a `.env` exists (see above)
- Run the migrations: `yarn migrate:dev`
- Start the development server: `yarn start:dev`

### Production

- Enable Corepack: `corepack enable`
- Install all dependencies: `yarn install`
- Make sure a `.env` exists (see above) or set the environment variables in your production environment
- Build the project: `yarn build`
- Run the migrations: `yarn prisma migrate deploy`
- Start the production server: `node build/src/index.js`


## Testen

- Enable Corepack: `corepack enable`
- Install all dependencies: `yarn install`
- Make sure `.env.test` exists (see above)
- Run the migrations: `yarn migrate:test`
- Run the tests: `yarn test`
 - This will start a new server for each test suite that runs, you won't see any output as logging is disabled to make output more clean.
  - The user suite will take 'long' (around 6s) to complete, this is normal as many cryptographic operations are being performed.
- Run the tests with coverage: `yarn test:coverage`

// __tests__/helpers/login.ts
import type supertest from 'supertest';

// 👇 1
export const login = async (supertest: supertest.Agent): Promise<string> => {
  // 👇 2
  const response = await supertest.post('/api/sessions').send({
    email: 'test.user@hogent.be',
    password: '12345678',
  });

  // 👇 3
  if (response.statusCode !== 200) {
    throw new Error(response.body.message || 'Unknown error occured');
  }

  // 👇 4
  return `Bearer ${response.body.token}`;
};

export const loginAdmin = async (
  supertest: supertest.Agent,
): Promise<string> => {
  const response = await supertest.post('/api/sessions').send({
    email: 'admin.user@hogent.be',
    password: '12345678',
  });
  
  if (response.statusCode !== 200) {
    throw new Error(response.body.message || 'Unknown error occured');
  }
  
  return `Bearer ${response.body.token}`;
};
  
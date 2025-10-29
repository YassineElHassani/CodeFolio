import User from '../../models/User';
import bcrypt from 'bcryptjs';
import { setupTestServer, teardownTestServer, clearDatabase, TestContext } from '../testUtils';
import fetch from 'node-fetch';

describe('Authentication', () => {
  let testContext: TestContext;

  beforeAll(async () => {
    testContext = await setupTestServer();
  });

  beforeEach(async () => {
    await clearDatabase();
    // Create test user
    const password = await bcrypt.hash('testpass123', 10);
    await User.create({
      username: 'testuser',
      password,
      isAdmin: true
    });
  });

  afterAll(async () => {
    await teardownTestServer(testContext);
  });

  describe('Login Mutation', () => {
    it('should login with valid credentials', async () => {
      const response = await fetch(testContext.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation Login($username: String!, $password: String!) {
              login(username: $username, password: $password) {
                token
              }
            }
          `,
          variables: {
            username: 'testuser',
            password: 'testpass123'
          },
        }),
      });

      const result = await response.json();
      expect(result.data?.login.token).toBeDefined();
      expect(typeof result.data?.login.token).toBe('string');
    });

    it('should not login with invalid password', async () => {
      const response = await fetch(testContext.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation Login($username: String!, $password: String!) {
              login(username: $username, password: $password) {
                token
              }
            }
          `,
          variables: {
            username: 'testuser',
            password: 'wrongpass'
          },
        }),
      });

      const result = await response.json();
      expect(result.errors).toBeDefined();
      expect(result.errors[0].message).toBe('Invalid credentials');
    });
  });
});
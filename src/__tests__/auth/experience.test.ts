import { TestContext, setupTestServer } from '../testUtils';
import { request } from 'graphql-request';
import User from '../../models/User';
import jwt from 'jsonwebtoken';
import Experience from '../../models/Experience';
import mongoose from 'mongoose';

let context: TestContext;
let adminToken: string;

beforeAll(async () => {
  context = await setupTestServer();
  
  // Create an admin user
  const adminUser = await User.create({
    username: 'admin',
    password: 'password123',
    isAdmin: true
  });
  
  adminToken = jwt.sign(
    { id: adminUser._id, username: adminUser.username },
    process.env.JWT_SECRET as string
  );
});

afterAll(async () => {
  await mongoose.disconnect();
  await context.mongoServer.stop();
  await context.httpServer.close();
});

describe('Experience Resolvers', () => {
  const testExperience = {
    company: 'Test Company',
    role: 'Test Role',
    startDate: '2023-01-01',
    endDate: '2023-12-31',
    details: 'Test job description'
  };

  let experienceId: string;

  test('createExperience - should create a new experience when admin', async () => {
    const mutation = `
      mutation CreateExperience($input: ExperienceInput!) {
        createExperience(input: $input) {
          id
          company
          role
          startDate
          endDate
          details
        }
      }
    `;

    const response = await request(context.url, mutation, {
      input: testExperience
    }, {
      Authorization: `Bearer ${adminToken}`
    });

    expect(response.createExperience).toMatchObject({
      company: testExperience.company,
      role: testExperience.role,

      details: testExperience.details
    });

    experienceId = response.createExperience.id;
  });

  test('getExperiences - should return all experiences', async () => {
    // Create a test experience first
    await request(context.url, `
      mutation CreateExperience($input: ExperienceInput!) {
        createExperience(input: $input) {
          id
          company
        }
      }
    `, {
      input: {
        company: "Test Company",
        role: "Test Role",
        startDate: "2023-01-01",
        endDate: "2023-12-31",
        details: "Test Details"
      }
    }, {
      Authorization: `Bearer ${adminToken}`
    });
    const query = `
      query {
        getExperiences {
          id
          company
          role
          startDate
          endDate
          details
        }
      }
    `;

    const response = await request(context.url, query);

    expect(response.getExperiences).toBeInstanceOf(Array);
    expect(response.getExperiences.length).toBeGreaterThan(0);
    expect(response.getExperiences[0]).toHaveProperty('role');
  });

  test('updateExperience - should update experience when admin', async () => {
    const updatedData = {
      company: 'Updated Company',
      role: 'Updated Role'
    };

    const mutation = `
      mutation UpdateExperience($id: ID!, $input: ExperienceInput!) {
        updateExperience(id: $id, input: $input) {
          id
          company
          role
        }
      }
    `;

    const response = await request(context.url, mutation, {
      id: experienceId,
      input: updatedData
    }, {
      Authorization: `Bearer ${adminToken}`
    });

    expect(response.updateExperience).toMatchObject(updatedData);
  });

  test('deleteExperience - should delete experience when admin', async () => {
    const mutation = `
      mutation DeleteExperience($id: ID!) {
        deleteExperience(id: $id)
      }
    `;

    const response = await request(context.url, mutation, {
      id: experienceId
    }, {
      Authorization: `Bearer ${adminToken}`
    });

    expect(response.deleteExperience).toBe(true);
  });
});
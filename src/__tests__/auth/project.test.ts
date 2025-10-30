import { TestContext, setupTestServer } from '../testUtils';
import { request } from 'graphql-request';
import User from '../../models/User';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import Project from '../../models/Project';

let context: TestContext;
let token: string;
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

describe('Project Resolvers', () => {
  const testProject = {
    title: 'Test Project',
    description: 'Test Description',
    url: 'https://test-project.com',
    image: 'https://test-image.com/image.png'
  };

  let projectId: string;

  test('createProject - should create a new project when admin', async () => {
    const mutation = `
      mutation CreateProject($input: ProjectInput!) {
        createProject(input: $input) {
          id
          title
          description
          url
          image
        }
      }
    `;

    const response = await request(context.url, mutation, {
      input: testProject
    }, {
      Authorization: `Bearer ${adminToken}`
    });

    expect(response.createProject).toMatchObject({
      title: testProject.title,
      description: testProject.description,
      url: testProject.url,
      image: testProject.image
    });

    projectId = response.createProject.id;
  });

  test('getProjects - should return projects with pagination', async () => {
    // Create a test project first
    await request(context.url, `
      mutation CreateProject($input: ProjectInput!) {
        createProject(input: $input) {
          id
          title
        }
      }
    `, {
      input: {
        title: "Test Project",
        description: "Test Description",
        url: "https://test.com"
      }
    }, {
      Authorization: `Bearer ${adminToken}`
    });
    const query = `
      query {
        getProjects {
          id
          title
          description
        }
      }
    `;

    const response = await request(context.url, query);

    expect(response.getProjects).toBeInstanceOf(Array);
  });

  test('updateProject - should update project when admin', async () => {
    const updatedData = {
      title: 'Updated Project',
      description: 'Updated Description'
    };

    const mutation = `
      mutation UpdateProject($id: ID!, $input: ProjectInput!) {
        updateProject(id: $id, input: $input) {
          id
          title
          description
        }
      }
    `;

    const response = await request(context.url, mutation, {
      id: projectId,
      input: updatedData
    }, {
      Authorization: `Bearer ${adminToken}`
    });

    expect(response.updateProject).toMatchObject(updatedData);
  });

  test('deleteProject - should delete project when admin', async () => {
    const mutation = `
      mutation DeleteProject($id: ID!) {
        deleteProject(id: $id)
      }
    `;

    const response = await request(context.url, mutation, {
      id: projectId
    }, {
      Authorization: `Bearer ${adminToken}`
    });

    expect(response.deleteProject).toBe(true);
  });
});
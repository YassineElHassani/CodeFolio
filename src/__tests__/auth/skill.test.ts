import { TestContext, setupTestServer } from '../testUtils';
import { request } from 'graphql-request';
import User from '../../models/User';
import jwt from 'jsonwebtoken';
import Skill from '../../models/Skill';
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

describe('Skill Resolvers', () => {
  const testSkill = {
    name: 'Test Skill',
    level: 'Advanced',
    icon: 'react'
  };

  let skillId: string;

  test('createSkill - should create a new skill when admin', async () => {
    const mutation = `
      mutation CreateSkill($input: SkillInput!) {
        createSkill(input: $input) {
          id
          name
          level
          icon
        }
      }
    `;

    const response = await request(context.url, mutation, {
      input: testSkill
    }, {
      Authorization: `Bearer ${adminToken}`
    });

    expect(response.createSkill).toMatchObject({
      name: testSkill.name,
      level: testSkill.level,

      icon: testSkill.icon
    });

    skillId = response.createSkill.id;
  });

  test('getSkills - should return all skills', async () => {
    // Create a test skill first
    await request(context.url, `
      mutation CreateSkill($input: SkillInput!) {
        createSkill(input: $input) {
          id
          name
        }
      }
    `, {
      input: {
        name: "Test Skill",
        level: "Advanced",
        icon: "react"
      }
    }, {
      Authorization: `Bearer ${adminToken}`
    });
    const query = `
      query {
        getSkills {
          id
          name
          level
          icon
        }
      }
    `;

    const response = await request(context.url, query);

    expect(response.getSkills).toBeInstanceOf(Array);
    expect(response.getSkills.length).toBeGreaterThan(0);
    expect(response.getSkills[0]).toHaveProperty('name');
  });

  test('updateSkill - should update skill when admin', async () => {
    const updatedData = {
      name: 'Updated Skill',
      level: 'Expert'
    };

    const mutation = `
      mutation UpdateSkill($id: ID!, $input: SkillInput!) {
        updateSkill(id: $id, input: $input) {
          id
          name
          level
        }
      }
    `;

    const response = await request(context.url, mutation, {
      id: skillId,
      input: updatedData
    }, {
      Authorization: `Bearer ${adminToken}`
    });

    expect(response.updateSkill).toMatchObject(updatedData);
  });

  test('deleteSkill - should delete skill when admin', async () => {
    const mutation = `
      mutation DeleteSkill($id: ID!) {
        deleteSkill(id: $id)
      }
    `;

    const response = await request(context.url, mutation, {
      id: skillId
    }, {
      Authorization: `Bearer ${adminToken}`
    });

    expect(response.deleteSkill).toBe(true);
  });
});
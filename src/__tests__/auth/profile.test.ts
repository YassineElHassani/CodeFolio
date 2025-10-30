import User from '../../models/User';
import Profile from '../../models/Profile';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { setupTestServer, teardownTestServer, clearDatabase, TestContext } from '../testUtils';
import fetch from 'node-fetch';

describe('Profile Operations', () => {
  let testContext: TestContext;
  let authToken: string;

  beforeAll(async () => {
    testContext = await setupTestServer();
    
    // Create test user and generate auth token
    const password = await bcrypt.hash('testpass123', 10);
    const user = await User.create({
      username: 'testuser',
      password,
      isAdmin: true
    });

    authToken = jwt.sign(
      { id: user._id, username: user.username, isAdmin: true },
      process.env.JWT_SECRET || 'test-secret-key',
      { expiresIn: '1h' }
    );
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await teardownTestServer(testContext);
  });

  describe('Update Profile', () => {
    it('should update profile with valid data and auth', async () => {
      const response = await fetch(testContext.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          query: `
            mutation UpdateProfile($input: ProfileInput!) {
              updateProfile(input: $input) {
                name
                title
                bio
                social {
                  platform
                  url
                }
              }
            }
          `,
          variables: {
            input: {
              name: "Test User",
              title: "Software Developer",
              bio: "Test bio",
              social: [
                {
                  platform: "GitHub",
                  url: "https://github.com/testuser"
                }
              ]
            }
          },
        }),
      });

      const result = await response.json();
      expect(result.data?.updateProfile).toBeDefined();
      expect(result.data?.updateProfile.name).toBe("Test User");
      expect(result.data?.updateProfile.title).toBe("Software Developer");
      expect(result.data?.updateProfile.social).toHaveLength(1);
      expect(result.data?.updateProfile.social[0].platform).toBe("GitHub");
    });

    it('should not update profile without auth token', async () => {
      const response = await fetch(testContext.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation UpdateProfile($input: ProfileInput!) {
              updateProfile(input: $input) {
                name
                title
              }
            }
          `,
          variables: {
            input: {
              name: "Test User",
              title: "Software Developer"
            }
          },
        }),
      });

      const result = await response.json();
      expect(result.errors).toBeDefined();
      expect(result.errors[0].message).toBe('Unauthorized');
    });
  });

  describe('Get Profile', () => {
    it('should get profile data', async () => {
      // First create a profile
      await Profile.create({
        name: "Test User",
        title: "Software Developer",
        bio: "Test bio",
        social: [
          {
            platform: "GitHub",
            url: "https://github.com/testuser"
          }
        ]
      });

      const response = await fetch(testContext.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            query GetProfile {
              getProfile {
                name
                title
                bio
                social {
                  platform
                  url
                }
              }
            }
          `,
        }),
      });

      const result = await response.json();
      expect(result.data?.getProfile).toBeDefined();
      expect(result.data?.getProfile.name).toBe("Test User");
      expect(result.data?.getProfile.title).toBe("Software Developer");
    });
  });
});
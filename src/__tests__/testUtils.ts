import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { createServer, Server } from 'http';
import express, { Express, Request } from 'express';
import { json } from 'body-parser';
import { AddressInfo } from 'net';
import typeDefs from '../schema';
import resolvers from '../resolvers';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';
import User from '../models/User';

export interface TestContext {
  server: ApolloServer;
  httpServer: Server;
  url: string;
  app: Express;
  mongoServer: MongoMemoryServer;
}

export async function setupTestServer(): Promise<TestContext> {
  // Set up test environment
  process.env.JWT_SECRET = 'test-secret-key';
  
  // Set up MongoDB Memory Server
  const mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  // Set up Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  // Set up Express
  const app = express();
  app.use(
    '/graphql',
    json(),
    expressMiddleware(server, {
      context: async ({ req }: { req: Request }) => {
        // Get the token from the Authorization header
        const header = req.headers['authorization'] || '';
        const token = header.startsWith('Bearer ') ? header.slice(7) : null;
        
        if (token) {
          try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
            return {
              user: {
                id: decoded.id,
                username: decoded.username,
                isAdmin: true
              },
              req
            };
          } catch (err) {
            console.error('Error verifying token:', err);
          }
        }
        
        return { user: null, req };
      }
    })
  );

  // Set up HTTP server
  const httpServer = createServer(app);
  await new Promise<void>((resolve) => httpServer.listen({ port: 0 }, resolve));
  
  const serverInfo = httpServer.address() as AddressInfo;
  const url = `http://localhost:${serverInfo.port}/graphql`;

  return { server, httpServer, url, app, mongoServer };
}

export async function teardownTestServer(context: TestContext) {
  await context.server.stop();
  await new Promise<void>((resolve) => context.httpServer.close(() => resolve()));
  await mongoose.connection.close();
  await context.mongoServer.stop();
}

export async function clearDatabase() {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
}
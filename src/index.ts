import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import http from 'http';
import typeDefs from './schema';
import resolvers from './resolvers';
import dotenv from 'dotenv';
import { connectDb } from './utils/connectDb';
import { getUserFromReq } from './utils/auth';
import { apiLimiter, authLimiter } from './middleware/rateLimiter';

dotenv.config();

const PORT = process.env.PORT || 4000;

async function start() {
  const app = express();

  await connectDb(process.env.MONGO_URI as string);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }: { req: any }) => {
      const user = await getUserFromReq(req);
      return { user };
    }
  } as any);

  await server.start();
  // applyMiddleware expects an Express Application type; cast to any to avoid mismatched typedefs
  server.applyMiddleware({ app: app as any, path: '/graphql' });

  // Apply rate limiting to all routes
  app.use('/graphql', apiLimiter);
  // Apply stricter rate limiting to auth mutations
  app.use('/graphql/auth', authLimiter);

  const httpServer = http.createServer(app);
  httpServer.listen({ port: PORT }, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
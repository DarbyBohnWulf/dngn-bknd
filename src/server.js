import 'core-js/stable';
import 'regenerator-runtime/runtime';
import express, { Request, Response } from 'express';
import { ApolloServer } from 'apollo-server-express';
import gqlSchema from './api/schema';
import * as jwt from 'jsonwebtoken';

const app = express();

const gqlServer = new ApolloServer({
  schema: gqlSchema,
  context: async ({ req, connection }) => {
    let authToken = null;
    let currentUser = null;
    let verified = null;

    try {
      if (authToken) {
        authToken = req.headers["authorization"].split(' ')[1];
        verified = jwt.verify(authToken, process.env.JWT_SECRET);
      }
      if (verified) {
        currentUser = jwt.decode(authToken).id;
      }
    } catch (err) {
      console.warn(`Couldn't authenticate with token: ${authToken}`, err);
    }

    return { authToken, currentUser, connection }
  }
});

gqlServer.applyMiddleware({app});

app.get('/', async (req,res, next) => {
  try {
    res.status(227).send('Gottem');
  } catch (err) {
    console.error("Couldn't get /\n", err);
  }
});

export default app;

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import express, { Request, Response } from 'express';
import { ApolloServer } from 'apollo-server-express';
import gqlUser, * as User from './models/user';

const app = express();

const gqlServer = new ApolloServer({schema: User.default});

gqlServer.applyMiddleware({app});

app.get('/', async (req,res, next) => {
  try {
    res.status(227).send('Gottem');
  } catch (err) {
    console.error("Couldn't get /\n", err);
  }
});

export default app;

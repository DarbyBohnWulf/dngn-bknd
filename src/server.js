import 'core-js/stable';
import 'regenerator-runtime/runtime';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import gqlSchema from './api/schema';
import * as jwt from 'jsonwebtoken';
import cors from 'cors';
import session from 'express-session';
import connectMongo from 'connect-mongo';

const app = express();

const MongoStore = connectMongo(session);

app.use(session({
  secret: process.env.SESSION_SECRET,
  name: 'dngn.sid',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ url: process.env.MONGO_URL })
}));

const gqlCORSOptions = {
  origin: [
    'http://0.0.0.0:3000', 'https://dngn-frnt.herokuapp.com', 'http://dngn-frnt.herokuapp.com'
  ],
  credentials: true,
}

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

gqlServer.applyMiddleware({app, cors: gqlCORSOptions});

app.use('/graphql', cors(gqlCORSOptions), async (req) => {
  console.log("got a req\n",req);  
});

app.get('/', async (req,res) => {
  try {
    res.status(227).send('Gottem');
  } catch (err) {
    console.error("Couldn't get /\n", err);
  }
});

export default app;

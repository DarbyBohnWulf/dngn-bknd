import 'core-js/stable';
import 'regenerator-runtime/runtime';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import gqlSchema from './api/schema';
import * as jwt from 'jsonwebtoken';
import cors from 'cors';
import session from 'express-session';
import connectMongo from 'connect-mongo';
import authRouter from './api/auth';

const app = express();

const MongoStore = connectMongo(session);

app.use(session({
  secret: process.env.SESSION_SECRET,
  name: 'dngn.sid',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ url: process.env.MONGO_URL }),
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV == 'production',
    sameSite: true,
    httpOnly: true,
  }
}));

const gqlCORSOptions = {
  origin: [
    'http://localhost:3000', 'https://dngn-frnt.herokuapp.com', 'http://dngn-frnt.herokuapp.com'
  ],
  credentials: true,
}

const gqlServer = new ApolloServer({
  schema: gqlSchema,
  context: async ({ req }) => {
    // let authToken = null;
    let currentUser = null;
    let verified = null;

    const authToken = req.headers.authorization.split()[1] || '';
    try {
      if (authToken) {
        verified = jwt.verify(authToken, process.env.JWT_SECRET) || false;
      }
      if (verified) {
        currentUser = verified._id;
      }
    } catch (err) {
      console.warn(`Couldn't authenticate with token: ${authToken}`, err);
    }

    return { ...req, currentUser, authToken }
  }
});

app.use(cors(gqlCORSOptions));

gqlServer.applyMiddleware({app, cors: false});

// dev middleware to examine all requests
// app.use('*', async (req,res, next) => {
//   console.log('got a req with a token?\n', req.session.token);
//   console.log("how about headers\n", req.headers);
//   next();
// });

app.use('/auth', authRouter);

export default app;

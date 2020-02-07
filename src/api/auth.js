import express from 'express';
import jwt from 'jsonwebtoken';

const authRouter = express.Router();

authRouter.get('/', async (req, res) => {
  console.log("incoming auth req\n", req.session);
  console.log("how about headers\n", req.headers);
  console.log("or cookies\n", req.cookies);
  const isAuthenticated = req.session.token
    ? jwt.verify(req.session.token, process.env.JWT_SECRET)
    : ''
  if (isAuthenticated) {
    console.log('authenticated\n', isAuthenticated);
    const {username, email, _id} = isAuthenticated;
    res.json({user:{username,email,_id}});
  } else {
    res.json({user:{username: null, email: null, id: null}});
  }
});

authRouter.post('/', async (req,res, next) => {
  console.log("logging in\n", req.session);
  console.log("this is the body\n", req.body);
  console.log("or cookies\n", req.cookies);
  req.session.okay = 'yes';
  res.status(200).json({okay:"yes"})
});

export default authRouter;

import express from 'express';
import jwt from 'jsonwebtoken';

const authRouter = express.Router();

authRouter.get('/', async (req, res) => {
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

authRouter.post('/', async (req, res) => {
  req.session.okay = 'yes';
  res.status(200).json({okay:"yes"})
});

export default authRouter;

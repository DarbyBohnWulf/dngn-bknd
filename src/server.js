import 'core-js/stable';
import 'regenerator-runtime/runtime';
import express, { Request, Response } from 'express';

const PORT = 3080;
const app = express();

app.get('/', async (req,res, next) => {
  try {
    res.status(227).send('Gottem');
  } catch (err) {
    console.error("Couldn't get /\n", err);
  }
});

app.listen(PORT, () => {
  console.log("App listening on port " + PORT);
});

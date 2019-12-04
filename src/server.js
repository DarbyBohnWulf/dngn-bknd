import express from 'express';

const PORT = 3080;
const app = express();

app.listen(PORT, () => {
  console.log("App listening on port " + PORT);
});

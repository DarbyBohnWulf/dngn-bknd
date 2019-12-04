import './db/db';
import app from './server';

const PORT = 3080;

app.listen(PORT, () => {
  console.log('Server listening on port ' + PORT);
});

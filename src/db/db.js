import { config } from 'dotenv';
config();
import mongoose from 'mongoose';

const connectionUrl = process.env.MONGO_URL;
const connectionOpts = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
};

mongoose.connect(connectionUrl, connectionOpts);

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected at URI ' + connectionUrl);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected from URI ' + connectionUrl);
});

mongoose.connection.on('error', (err) => {
  console.error("MongoDB experienced a problem:\n" + err);
});

import './pre-start'; // Must be the first import
import logger from 'jet-logger';
import { connect } from 'mongoose';
import mongoose from 'mongoose';
import EnvVars from '@src/common/EnvVars';
import server from './server';

// **** Run **** //

const SERVER_START_MSG = ('Express server started on port: ' + 
  EnvVars.Port.toString());

console.log(EnvVars.MongoDb_URI);
console.log(process.env.MONGODB_URI);
  
// Connecter à la base de données
// connect(EnvVars.MongoDb_URI)
//   .then(() => server.listen(EnvVars.Port, () => logger.info(SERVER_START_MSG)))
//   .catch((err) => logger.err(err, true));

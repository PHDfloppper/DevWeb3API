/**
 * Setup express server.
 */
import './pre-start'; 
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import helmet from 'helmet';
import express, { Request, Response, NextFunction } from 'express';
import logger from 'jet-logger';

import 'express-async-errors';

import BaseRouter from '@src/routes';

import Paths from '@src/common/Paths';
import EnvVars from '@src/common/EnvVars';
import HttpStatusCodes from '@src/common/HttpStatusCodes';
import { RouteError } from '@src/common/classes';
import { NodeEnvs } from '@src/common/misc';
import { connect } from 'mongoose';
import mongoose from 'mongoose';
import server from './server';
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');


// **** Variables **** //

const app = express();
const cors = require('cors');
const SERVER_START_MSG = ('Express server started on port: ' + 
  EnvVars.Port.toString());

// **** Setup **** //

// Charger la documentation swagger en YAML
const swaggerDocument = YAML.load('./openapi.yaml');

// Rendre la documentation disponible sur l'endpoint "/api-docs"
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser(EnvVars.CookieProps.Secret));

// Show routes called in console during development
if (EnvVars.NodeEnv === NodeEnvs.Dev.valueOf()) {
  app.use(morgan('dev'));
}

// Security
if (EnvVars.NodeEnv === NodeEnvs.Production.valueOf()) {
  app.use(helmet());
}

app.use(cors({
  origin: ['http://localhost:5173', 'https://olidevwebreact.netlify.app'], // Liste des origines autorisées
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Méthodes HTTP autorisées
  allowedHeaders: ['Content-Type', 'Authorization'], // En-têtes autorisés
  credentials: true, // Autoriser l'envoi de cookies et d'en-têtes d'authentification
}));

// Add APIs, must be after middleware
app.use(Paths.Base, BaseRouter);

// Add error handler
app.use((
  err: Error,
  _: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  if (EnvVars.NodeEnv !== NodeEnvs.Test.valueOf()) {
    logger.err(err, true);
  }
  let status = HttpStatusCodes.BAD_REQUEST;
  if (err instanceof RouteError) {
    status = err.status;
  }
  return res.status(status).json({ error: err.message });
});

// rend disponible la documentation de l'interface logicielle
app.get('/api-docs/', async (req, res) => {
  res.set('Content-Security-Policy', 'script-src blob:');
  res.set('Content-Security-Policy', 'worker-src blob:');
  res.sendFile(path.join(__dirname, 'index.html'));
});

// redirige vers api-docs
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});
// **** Front-End Content **** //

// Set views directory (html)
const viewsDir = path.join(__dirname, 'views');
app.set('views', viewsDir);

// Set static directory (js and css).
const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir));

// Nav to users pg by default
app.get('/', (_: Request, res: Response) => {
  return res.redirect('/api/joueur/all');
});

//Redirect to login if not logged in.
// app.get('/users', (_: Request, res: Response) => {
//   return res.sendFile('users.html', { root: viewsDir });
// });

connect(EnvVars.MongoDb_URI)
  .then(() => server.listen(EnvVars.Port, () => logger.info(SERVER_START_MSG)))
  .catch((err) => logger.err(err, true));

// **** Export default **** //

export default app;

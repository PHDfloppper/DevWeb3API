// types.ts

import { Request, Response } from 'express';

// Typage pour les paramètres de route
type TParams = Record<string, string>;

// Typage pour le corps de la requête
type TBody = Record<string, unknown>;

// Typage pour les paramètres de requête
type TQuery = Record<string, string>;

// Définir les types pour les requêtes
export type IReq<P = TParams, B = TBody, Q = TQuery> = Request<P, any, B, Q>;

// Définir le type pour les réponses
export type IRes = Response<unknown, Record<string, unknown>>;

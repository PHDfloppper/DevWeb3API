import { Router } from 'express';

import Paths from '../common/Paths';
import UserRoutes from './UserRoutes';
import InventaireRoutes from './InventaireRoutes';


// **** Variables **** //

const apiRouter = Router();


// ** Add UserRouter ** //

// Init router
const userRouter = Router();

// Get all users
userRouter.get(Paths.Users.Get, UserRoutes.getAll);
userRouter.post(Paths.Users.Add, UserRoutes.add);
userRouter.put(Paths.Users.Update, UserRoutes.update);
userRouter.delete(Paths.Users.Delete, UserRoutes.delete);

// Add UserRouter
apiRouter.use(Paths.Users.Base, userRouter);

const joueurRouter = Router()
joueurRouter.get(Paths.Joueur.Get, InventaireRoutes.getAll);
joueurRouter.get(Paths.Joueur.GetByName, InventaireRoutes.getByName);
joueurRouter.get(Paths.Joueur.GetById, InventaireRoutes.getById);
joueurRouter.get(Paths.Joueur.GetByVersion, InventaireRoutes.getByVersion);
joueurRouter.post(Paths.Joueur.Add, InventaireRoutes.add);
joueurRouter.put(Paths.Joueur.Update, InventaireRoutes.update);
joueurRouter.delete(Paths.Joueur.Delete, InventaireRoutes.delete);

apiRouter.use(Paths.Joueur.Base, joueurRouter)

// **** Export default **** //

export default apiRouter;

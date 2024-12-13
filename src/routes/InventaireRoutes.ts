import HttpStatusCodes from '@src/common/HttpStatusCodes';
import check from './common/check';
import InvenaireService from '@src/services/InvenaireService';  // Assurez-vous que le service est adapté
import { JoueurModel, IJoueur } from '@src/models/Inventaire';
import { IReq, IRes } from './common/types';

// **** Functions **** //

// Fonction de validation pour IJoueur
function isJoueur(obj: any): obj is IJoueur {
  console.log('Validation des données :', obj);  // Log des données pour vérifier ce qui est envoyé
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.nomJoueur === 'string' &&
    typeof obj.versionMinecraft === 'string' &&
    Array.isArray(obj.inventaire.blocs) &&
    obj.inventaire.blocs.every((bloc: any) => bloc && typeof bloc.type === 'string' && typeof bloc.quantite === 'number') &&
    Array.isArray(obj.inventaire.outils) &&
    obj.inventaire.outils.every((outil: any) => outil && typeof outil.type === 'string' && typeof outil.materiau === 'string' && typeof outil.durabilite === 'number') &&
    Array.isArray(obj.succes) &&
    obj.succes.every((succes: any) => succes && typeof succes.nom === 'string' && typeof succes.description === 'string' && (typeof succes.dateObtention === 'string' || succes.dateObtention instanceof Date)) &&
    (obj.heuresJeu === undefined || typeof obj.heuresJeu === 'number') &&
    typeof obj.modeHardcore === 'boolean'
  );
}
//vérification de l'id
function extractId(params: any, key: string): string | null {
  const value = params[key];
  return typeof value === 'string' && /^[0-9a-fA-F]{24}$/.test(value) ? value : null;
}

/**
 * Lire tous les joueurs.
 */
async function getAll(_: IReq, res: IRes) {
  try {
    const joueurs = await InvenaireService.getAll();  // Appel au service de joueurs
    return res.status(HttpStatusCodes.OK).json(joueurs);
  } catch (error) {
    console.error('Erreur lors de la récupération des joueurs:', error);
    return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Erreur lors de la récupération des joueurs' });
  }
}

/**
 * Récupérer un joueur par son nom.
 */
async function getByName(req: IReq<{ nom: string }>, res: IRes) {
    try {
      const { nom } = req.params; // Récupère le nom du joueur depuis les paramètres
      const joueurs = await InvenaireService.getByName(nom); // Appel au service
  
      if (!joueurs) {
        return res.status(HttpStatusCodes.NOT_FOUND).json({ error: 'Joueur non trouvé' });
      }
  
      return res.status(HttpStatusCodes.OK).json(joueurs);
    } catch (error) {
      console.error('Erreur lors de la récupération du joueur par nom:', error);
      return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Erreur lors de la récupération du joueur' });
    }
  }

/**
 * Récupérer un joueur par la version du jeu
 */
async function getByVersion(req: IReq<{ version: number }>, res: IRes) {
  try {
    const { version } = req.params; // Récupère le nom du joueur depuis les paramètres
    const joueurs = await InvenaireService.getByVersion(version); // Appel au service

    if (!joueurs || joueurs.length === 0) {
      return res.status(HttpStatusCodes.NOT_FOUND).json({ error: 'Aucun joueur trouvé pour cette version.' });
    }

    return res.status(HttpStatusCodes.OK).json(joueurs);
  } catch (error) {
    console.error('Erreur lors de la récupération des joueurs par version :', error);
    return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Erreur lors de la récupération des joueurs.' });
  }
}

/**
 * Récupérer un joueur par son ID.
 */
async function getById(req: IReq<{ id: string }>, res: IRes) {
  try {
    const id = extractId(req.params, 'id');

    if (!id) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({ error: 'ID de joueur invalide' });
    }

    const joueur = await InvenaireService.getById(id); // Appel au service `getById`

    if (!joueur) {
      return res.status(HttpStatusCodes.NOT_FOUND).json({ error: 'Joueur non trouvé' });
    }

    return res.status(HttpStatusCodes.OK).json(joueur);
  } catch (error) {
    console.error('Erreur lors de la récupération du joueur par ID:', error);
    return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Erreur lors de la récupération du joueur' });
  }
}

/**
 * Ajoute un joueur.
 */
async function add(req: IReq, res: IRes) {
  try {
    // Valide req.body
    const joueurs = req.body;
    if (!isJoueur(joueurs)) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({ error: 'Données de joueur invalides' });
    }
    // Appel correct de la méthode de service
    await InvenaireService.add(joueurs);
    return res.status(HttpStatusCodes.CREATED).end();
  } catch (error) {
    console.error('Erreur lors de l\'ajout du joueur:', error);
    return res.status(HttpStatusCodes.BAD_REQUEST).json({ error: 'Erreur lors de l\'ajout du joueur' });
  }
}

/**
 * Mise à jour d'un joueur.
 */
async function update(req: IReq<{ id: string }>, res: IRes) {
  try {
    const id = extractId(req.params, 'id');

    // Vérification si l'ID est valide
    if (!id) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({ error: 'ID invalide dans l\'URL' });
    }

    const joueurs = req.body; // Assurez-vous que req.body est de type IJoueur

    // Vérification que les données du joueur sont valides
    if (!isJoueur(joueurs)) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({ error: 'Données de joueur invalides' });
    }

    if (joueurs._id) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({ error: 'il ne doit pas y avoir de id dans les donnes' });
    }

    // Appel de la méthode de service pour mettre à jour le joueur
    const updatedJoueur = await InvenaireService.update(joueurs, id);

    return res.status(HttpStatusCodes.OK).json({ joueur: updatedJoueur });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du joueur:', error);
    return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Erreur interne du serveur lors de la mise à jour du joueur' });
  }
}

/**
 * Supprimer un joueur.
 */
async function delete_(req: IReq<{ id: string }>, res: IRes) {
  try {
    const id = extractId(req.params, 'id'); // Utilise extractId pour valider l'ID

    if (!id) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({ error: 'ID de joueur invalide' });
    }

    await InvenaireService.delete(id); // Appel au service de suppression
    return res.status(HttpStatusCodes.OK).end();
  } catch (error) {
    console.error('Erreur lors de la suppression du joueur:', error);
    return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Erreur lors de la suppression du joueur' });
  }
}

// **** Export default **** //

export default {
  getAll,
  getByName,
  getByVersion,
  getById,
  add,
  update,
  delete: delete_,
} as const;

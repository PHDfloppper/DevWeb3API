import { JoueurModel, IJoueur } from '@src/models/Inventaire';
import { getRandomInt } from '@src/util/misc'; // Assurez-vous que cette fonction est correcte et accessible

// **** Functions **** //

/**
 * Vérifier si un joueur avec l'ID donné existe.
 */
async function persists(id: string): Promise<boolean> {
  const count = await JoueurModel.countDocuments({ _id: id }).exec();
  return count > 0;
}

/**
 * Récupérer tous les joueurs.
 */
async function getAll(): Promise<IJoueur[]> {
  return JoueurModel.find().exec();
}

/**
 * Récupérer un joueur par son nom.
 */
async function getByName(nom: string): Promise<IJoueur | null> {
  return JoueurModel.findOne({ nomJoueur: nom }).exec();
}

async function getByVersion(version: number): Promise<IJoueur[]> {
  return JoueurModel.find({ versionMinecraft: version }).exec();
}

async function getById(id: string): Promise<IJoueur | null> {
  return JoueurModel.findById(id).exec();
}

/**
 * Ajouter un joueur.
 */
async function add(joueur: IJoueur): Promise<void> {
  // if (!joueur._id) {
  //   joueur._id = getRandomInt().toString();
  // }

  const nouveauJoueur = new JoueurModel(joueur);
  await nouveauJoueur.save();
}

/**
 * Mettre à jour un joueur.
 */
async function update(joueur: IJoueur, id: string): Promise<void> {
  await JoueurModel.findByIdAndUpdate(id, joueur).exec();
}

/**
 * Supprimer un joueur.
 */
async function delete_(id: string): Promise<void> {
  await JoueurModel.findByIdAndDelete(id).exec();
}

// **** Export default **** //

export default {
  persists,
  getAll,
  getByName,
  getByVersion,
  getById,
  add,
  update,
  delete: delete_,
} as const;
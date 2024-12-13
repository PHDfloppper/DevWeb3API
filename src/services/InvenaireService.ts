import { JoueurModel, IJoueur } from "@src/models/Inventaire";
import InventaireRepo from "@src/repos/InventaireRepo";

/**
 * Vérifie si un joueur avec l'ID donné existe.
 */
async function persists(id: string): Promise<boolean> {
  const count = await JoueurModel.countDocuments({ _id: id }).exec();
  return count > 0;
}

/**
 * Récupère tous les joueurs.
 */
async function getAll(): Promise<IJoueur[]> {
  return JoueurModel.find().exec();
}

/**
 * Récupère un joueur par son nom.
 */
async function getByName(nom: string): Promise<IJoueur | null> {
  return JoueurModel.findOne({ nomJoueur: nom }).exec();
}

async function getByVersion(version: number): Promise<IJoueur[]> {
  const joueurs = await JoueurModel.find({ versionMinecraft: version }).exec();
  return joueurs || [];  // Retourne un tableau vide si aucun joueur n'est trouvé
}

async function getById(id: string): Promise<IJoueur | null> {
  return JoueurModel.findById(id).exec();
}
/**
 * Ajoute un joueur.
 */
async function add(joueur: IJoueur): Promise<void> {
  const nouveauJoueur = new JoueurModel(joueur);
  await nouveauJoueur.save();
}

/**
 * Met à jour un joueur.
 */
async function update(joueur: IJoueur,id:string): Promise<void> {
  await JoueurModel.findByIdAndUpdate(id, joueur).exec();
}

/**
 * Supprime un joueur.
 */
async function delete_(id: string): Promise<void> {
  await JoueurModel.findByIdAndDelete(id).exec();
}

export default {
  persists,
  getAll,
  getByName,
  getById,
  getByVersion,
  add,
  update,
  delete: delete_,
};
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
    return JoueurModel.findOne({ nomJoueur: nom }).exec(); // Assurez-vous que "nomJoueur" correspond au bon champ
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
async function update(joueur: IJoueur): Promise<void> {
  await JoueurModel.findByIdAndUpdate(joueur._id, joueur).exec();
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
  add,
  update,
  delete: delete_,
};
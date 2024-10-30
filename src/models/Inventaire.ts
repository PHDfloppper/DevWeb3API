import mongoose, { Document, Model, Schema } from 'mongoose';

// Définition des interfaces
export interface IBloc {
  type: string;
  quantite: number;
}

export interface IOutil {
  type: string;
  materiau: string;
  durabilite: number;
}

export interface ISucces {
  nom: string;
  description: string;
  dateObtention: Date;
}

export interface IInventaire {
  blocs: IBloc[];
  outils: IOutil[];
}

export interface IJoueur extends Document {
  nomJoueur: string;
  versionMinecraft: string;
  inventaire: IInventaire;
  succes: ISucces[];
  heuresJeu: number;
  modeHardcore: boolean;
}

const blocSchema = new Schema<IBloc>({
  type: { type: String, required: true },
  quantite: { type: Number, required: true }
});

const outilSchema = new Schema<IOutil>({
  type: { type: String, required: true },
  materiau: { type: String, required: true },
  durabilite: { type: Number, required: true }
});

const succesSchema = new Schema<ISucces>({
  nom: { type: String, required: true },
  description: { type: String, required: true },
  dateObtention: { type: Date, required: true }
});

const inventaireSchema = new Schema<IInventaire>({
  blocs: { type: [blocSchema], required: true },
  outils: { type: [outilSchema], required: true }
});

const joueurSchema = new Schema<IJoueur>({
  nomJoueur: { type: String, required: true },
  versionMinecraft: { type: String, required: true },
  inventaire: { type: inventaireSchema, required: true },
  succes: { type: [succesSchema], required: true },
  heuresJeu: { type: Number, required: true },
  modeHardcore: { type: Boolean, required: true }
});

mongoose.pluralize(null);
export const JoueurModel: Model<IJoueur> = mongoose.model<IJoueur>('Inventaires', joueurSchema);

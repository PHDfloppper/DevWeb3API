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
  type: { type: String },
  quantite: { 
    type: Number,
    validate: {
      validator: function(quan: number) {
        return quan >= 0 && quan <= 64;
      },
      message: props => `${props.value} n'est pas une quantité valide, elle doit être entre 0 et 64.`
    }
  }
});

const outilSchema = new Schema<IOutil>({
  type: {
    type: String,
    validate: {
      validator: function(outil: string) {
        // Vérifie si le type de l'outil est vide ou fait partie des types valides
        return !outil || ["Houe", "Hache", "Pioche", "Trident", "Arc", "Épée", "Pelle"].includes(outil);
      },
      message: props => `Le type d'outil doit être vide ou l'un des suivants : "Houe", "Hache", "Pioche", "Trident", "Arc", "Épée", "Pelle".`
    }
  },
  materiau: { type: String },
  durabilite: { type: Number }
});

const succesSchema = new Schema<ISucces>({
  nom: { type: String, required: true },
  description: { type: String },
  dateObtention: { type: Date }
});

const inventaireSchema = new Schema<IInventaire>({
  blocs: { type: [blocSchema] },
  outils: {
    type: [outilSchema],
    validate: {
      validator: function(outil: IOutil[]) {
        return outil.length <= 4;  // Limiter à 4 outils
      },
      message: props => `Le nombre d'outils ne peut pas dépasser 4, actuellement il y en a ${props.value.length}.`
    }
  }
});

const joueurSchema = new Schema<IJoueur>({
  nomJoueur: { type: String, required: true },
  versionMinecraft: {
    type: String,
    validate: {
      validator: function(version: string) {
        return /^\d+\.\d+\.\d+$/.test(version);  // Vérifie le format x.y.z
      },
      message: props => `La version de Minecraft doit être au format x.y.z.`
    }
  },
  inventaire: { type: inventaireSchema },
  succes: { type: [succesSchema] },
  heuresJeu: { type: Number, required: true },
  modeHardcore: { type: Boolean, required: true }
});

mongoose.pluralize(null);
export const JoueurModel: Model<IJoueur> = mongoose.model<IJoueur>('Inventaires', joueurSchema);

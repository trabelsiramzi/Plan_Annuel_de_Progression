import { IAffectation } from 'app/entities/affectation/affectation.model';

export interface IProjet {
  id: number;
  titreprojet?: string | null;
  nomprojet?: Pick<IAffectation, 'id'> | null;
}

export type NewProjet = Omit<IProjet, 'id'> & { id: null };

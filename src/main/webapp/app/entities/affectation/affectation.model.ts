import dayjs from 'dayjs/esm';
import { IProjet } from 'app/entities/projet/projet.model';

export interface IAffectation {
  id: number;
  nomprojet?: string | null;
  description?: string | null;
  datedebut?: dayjs.Dayjs | null;
  datefin?: dayjs.Dayjs | null;
  projet?: Pick<IProjet, 'id'> | null;
}

export type NewAffectation = Omit<IAffectation, 'id'> & { id: null };

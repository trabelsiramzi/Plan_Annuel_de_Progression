import dayjs from 'dayjs/esm';
import { IEtablissement } from 'app/entities/etablissement/etablissement.model';

export interface IAffectationAdmin {
  id: number;
  datedebut?: dayjs.Dayjs | null;
  datefin?: dayjs.Dayjs | null;
  etablissement?: Pick<IEtablissement, 'id'> | null;
}

export type NewAffectationAdmin = Omit<IAffectationAdmin, 'id'> & { id: null };

import dayjs from 'dayjs/esm';

export interface IAffectationAdmin {
  id: number;
  datedebut?: dayjs.Dayjs | null;
  datefin?: dayjs.Dayjs | null;
}

export type NewAffectationAdmin = Omit<IAffectationAdmin, 'id'> & { id: null };

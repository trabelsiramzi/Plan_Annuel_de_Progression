import dayjs from 'dayjs/esm';
import { IProjet } from 'app/entities/projet/projet.model';
import { IEmployee } from 'app/entities/employee/employee.model';

export interface IAffectation {
  id: number;
  nomprojet?: string | null;
  description?: string | null;
  datedebut?: dayjs.Dayjs | null;
  datefin?: dayjs.Dayjs | null;
  projet?: Pick<IProjet, 'id'> | null;
  employees?: Pick<IEmployee, 'id'>[] | null;
}

export type NewAffectation = Omit<IAffectation, 'id'> & { id: null };

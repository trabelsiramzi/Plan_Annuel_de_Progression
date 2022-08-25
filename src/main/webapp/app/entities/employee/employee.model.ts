import dayjs from 'dayjs/esm';
import { IAffectation } from 'app/entities/affectation/affectation.model';
import { ICompetance } from 'app/entities/competance/competance.model';

export interface IEmployee {
  id: number;
  nom?: string | null;
  prenom?: string | null;
  email?: string | null;
  numtel?: string | null;
  dateembauche?: dayjs.Dayjs | null;
  manager?: Pick<IEmployee, 'id'> | null;
  teamlead?: Pick<IEmployee, 'id'> | null;
  affectations?: Pick<IAffectation, 'id'>[] | null;
  competances?: Pick<ICompetance, 'id'>[] | null;
}

export type NewEmployee = Omit<IEmployee, 'id'> & { id: null };

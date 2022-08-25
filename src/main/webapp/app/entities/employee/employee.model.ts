import dayjs from 'dayjs/esm';
import { IAffectation } from 'app/entities/affectation/affectation.model';
import { IAffectationAdmin } from 'app/entities/affectation-admin/affectation-admin.model';

export interface IEmployee {
  id: number;
  nom?: string | null;
  prenom?: string | null;
  email?: string | null;
  numtel?: string | null;
  dateembauche?: dayjs.Dayjs | null;
  affectation?: Pick<IAffectation, 'id'> | null;
  affectationAdmin?: Pick<IAffectationAdmin, 'id'> | null;
}

export type NewEmployee = Omit<IEmployee, 'id'> & { id: null };

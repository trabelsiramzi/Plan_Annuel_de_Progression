import dayjs from 'dayjs/esm';

export interface IEmployee {
  id: number;
  nom?: string | null;
  prenom?: string | null;
  email?: string | null;
  numtel?: string | null;
  dateembauche?: dayjs.Dayjs | null;
  manager?: Pick<IEmployee, 'id'> | null;
}

export type NewEmployee = Omit<IEmployee, 'id'> & { id: null };

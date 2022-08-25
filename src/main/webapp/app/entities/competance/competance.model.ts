import { IEmployee } from 'app/entities/employee/employee.model';

export interface ICompetance {
  id: number;
  nomCompetance?: string | null;
  description?: string | null;
  niveau?: number | null;
  employees?: Pick<IEmployee, 'id'>[] | null;
}

export type NewCompetance = Omit<ICompetance, 'id'> & { id: null };

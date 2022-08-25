import dayjs from 'dayjs/esm';
import { IEmployee } from 'app/entities/employee/employee.model';

export interface IEntretien {
  id: number;
  dateentretient?: dayjs.Dayjs | null;
  resultat?: string | null;
  confirmationresponsable?: string | null;
  confirmationsalarie?: string | null;
  employee?: Pick<IEmployee, 'id'> | null;
}

export type NewEntretien = Omit<IEntretien, 'id'> & { id: null };

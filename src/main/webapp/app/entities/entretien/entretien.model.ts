import dayjs from 'dayjs/esm';
import { IResponsable } from 'app/entities/responsable/responsable.model';

export interface IEntretien {
  id: number;
  dateentretient?: dayjs.Dayjs | null;
  resultat?: string | null;
  confirmationresponsable?: string | null;
  confirmationsalarie?: string | null;
  responsable?: Pick<IResponsable, 'id'> | null;
}

export type NewEntretien = Omit<IEntretien, 'id'> & { id: null };

import { IAffectation } from 'app/entities/affectation/affectation.model';

export interface ICompetance {
  id: number;
  nomCompetance?: string | null;
  description?: string | null;
  niveau?: number | null;
  affectation?: Pick<IAffectation, 'id'> | null;
}

export type NewCompetance = Omit<ICompetance, 'id'> & { id: null };

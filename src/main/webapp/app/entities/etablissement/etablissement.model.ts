import { IAffectationAdmin } from 'app/entities/affectation-admin/affectation-admin.model';

export interface IEtablissement {
  id: number;
  nometablissement?: string | null;
  manager?: number | null;
  teamlead?: number | null;
  affectationAdmin?: Pick<IAffectationAdmin, 'id'> | null;
}

export type NewEtablissement = Omit<IEtablissement, 'id'> & { id: null };

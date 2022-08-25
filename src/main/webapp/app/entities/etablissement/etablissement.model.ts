export interface IEtablissement {
  id: number;
  nometablissement?: string | null;
  manager?: number | null;
  teamlead?: number | null;
}

export type NewEtablissement = Omit<IEtablissement, 'id'> & { id: null };

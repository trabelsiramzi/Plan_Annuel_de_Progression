export interface IResponsable {
  id: number;
  nommanager?: string | null;
  nomteamlead?: string | null;
}

export type NewResponsable = Omit<IResponsable, 'id'> & { id: null };

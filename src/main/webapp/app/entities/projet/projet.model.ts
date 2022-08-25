export interface IProjet {
  id: number;
  titreprojet?: string | null;
}

export type NewProjet = Omit<IProjet, 'id'> & { id: null };

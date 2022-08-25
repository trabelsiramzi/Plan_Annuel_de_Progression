import { IProjet, NewProjet } from './projet.model';

export const sampleWithRequiredData: IProjet = {
  id: 59803,
};

export const sampleWithPartialData: IProjet = {
  id: 96269,
  titreprojet: 'parallelism Berkshire',
};

export const sampleWithFullData: IProjet = {
  id: 61660,
  titreprojet: 'a invoice',
};

export const sampleWithNewData: NewProjet = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);

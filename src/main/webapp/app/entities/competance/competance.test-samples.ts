import { ICompetance, NewCompetance } from './competance.model';

export const sampleWithRequiredData: ICompetance = {
  id: 86980,
};

export const sampleWithPartialData: ICompetance = {
  id: 17836,
  nomCompetance: 'Computers Fantastic AGP',
};

export const sampleWithFullData: ICompetance = {
  id: 90111,
  nomCompetance: 'Mouse Pastourelle SQL',
  description: 'wireless',
  niveau: 46884,
};

export const sampleWithNewData: NewCompetance = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);

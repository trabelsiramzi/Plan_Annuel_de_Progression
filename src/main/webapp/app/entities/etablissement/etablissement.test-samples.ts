import { IEtablissement, NewEtablissement } from './etablissement.model';

export const sampleWithRequiredData: IEtablissement = {
  id: 16156,
};

export const sampleWithPartialData: IEtablissement = {
  id: 59513,
  manager: 331,
};

export const sampleWithFullData: IEtablissement = {
  id: 2800,
  nometablissement: 'even-keeled Table white',
  manager: 16355,
  teamlead: 12419,
};

export const sampleWithNewData: NewEtablissement = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);

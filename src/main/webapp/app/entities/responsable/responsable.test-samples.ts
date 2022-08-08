import { IResponsable, NewResponsable } from './responsable.model';

export const sampleWithRequiredData: IResponsable = {
  id: 62020,
};

export const sampleWithPartialData: IResponsable = {
  id: 40598,
};

export const sampleWithFullData: IResponsable = {
  id: 53287,
  nommanager: 'Sleek redundant',
  nomteamlead: 'repurpose',
};

export const sampleWithNewData: NewResponsable = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);

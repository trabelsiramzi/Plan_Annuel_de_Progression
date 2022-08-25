import dayjs from 'dayjs/esm';

import { IAffectation, NewAffectation } from './affectation.model';

export const sampleWithRequiredData: IAffectation = {
  id: 17011,
};

export const sampleWithPartialData: IAffectation = {
  id: 95171,
  description: 'aggregate model',
  datedebut: dayjs('2022-08-24T18:16'),
  datefin: dayjs('2022-08-25T04:33'),
};

export const sampleWithFullData: IAffectation = {
  id: 30410,
  nomprojet: 'paradigms SCSI',
  description: 'system a',
  datedebut: dayjs('2022-08-24T14:50'),
  datefin: dayjs('2022-08-24T12:51'),
};

export const sampleWithNewData: NewAffectation = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);

import dayjs from 'dayjs/esm';

import { IAffectation, NewAffectation } from './affectation.model';

export const sampleWithRequiredData: IAffectation = {
  id: 17011,
};

export const sampleWithPartialData: IAffectation = {
  id: 95171,
  description: 'aggregate model',
  datedebut: dayjs('2022-08-24T20:32'),
  datefin: dayjs('2022-08-25T06:49'),
};

export const sampleWithFullData: IAffectation = {
  id: 30410,
  nomprojet: 'paradigms SCSI',
  description: 'system a',
  datedebut: dayjs('2022-08-24T17:06'),
  datefin: dayjs('2022-08-24T15:07'),
};

export const sampleWithNewData: NewAffectation = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);

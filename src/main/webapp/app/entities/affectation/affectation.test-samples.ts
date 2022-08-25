import dayjs from 'dayjs/esm';

import { IAffectation, NewAffectation } from './affectation.model';

export const sampleWithRequiredData: IAffectation = {
  id: 17011,
};

export const sampleWithPartialData: IAffectation = {
  id: 95171,
  description: 'aggregate model',
  datedebut: dayjs('2022-08-24T18:45'),
  datefin: dayjs('2022-08-25T05:02'),
};

export const sampleWithFullData: IAffectation = {
  id: 30410,
  nomprojet: 'paradigms SCSI',
  description: 'system a',
  datedebut: dayjs('2022-08-24T15:19'),
  datefin: dayjs('2022-08-24T13:20'),
};

export const sampleWithNewData: NewAffectation = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);

import dayjs from 'dayjs/esm';

import { IAffectationAdmin, NewAffectationAdmin } from './affectation-admin.model';

export const sampleWithRequiredData: IAffectationAdmin = {
  id: 8112,
};

export const sampleWithPartialData: IAffectationAdmin = {
  id: 54831,
  datedebut: dayjs('2022-08-24T17:15'),
  datefin: dayjs('2022-08-24T21:39'),
};

export const sampleWithFullData: IAffectationAdmin = {
  id: 91440,
  datedebut: dayjs('2022-08-24T22:49'),
  datefin: dayjs('2022-08-25T04:30'),
};

export const sampleWithNewData: NewAffectationAdmin = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);

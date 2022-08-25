import dayjs from 'dayjs/esm';

import { IAffectationAdmin, NewAffectationAdmin } from './affectation-admin.model';

export const sampleWithRequiredData: IAffectationAdmin = {
  id: 8112,
};

export const sampleWithPartialData: IAffectationAdmin = {
  id: 54831,
  datedebut: dayjs('2022-08-24T17:59'),
  datefin: dayjs('2022-08-24T22:23'),
};

export const sampleWithFullData: IAffectationAdmin = {
  id: 91440,
  datedebut: dayjs('2022-08-24T23:33'),
  datefin: dayjs('2022-08-25T05:14'),
};

export const sampleWithNewData: NewAffectationAdmin = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);

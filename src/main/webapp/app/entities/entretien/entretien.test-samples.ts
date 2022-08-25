import dayjs from 'dayjs/esm';

import { IEntretien, NewEntretien } from './entretien.model';

export const sampleWithRequiredData: IEntretien = {
  id: 14669,
};

export const sampleWithPartialData: IEntretien = {
  id: 62543,
  dateentretient: dayjs('2022-08-24T09:19'),
  confirmationsalarie: 'Sleek USB',
};

export const sampleWithFullData: IEntretien = {
  id: 70771,
  dateentretient: dayjs('2022-08-24T07:11'),
  resultat: 'Grèce',
  confirmationresponsable: 'superstructure b',
  confirmationsalarie: 'Licensed c',
};

export const sampleWithNewData: NewEntretien = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);

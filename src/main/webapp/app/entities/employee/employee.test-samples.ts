import dayjs from 'dayjs/esm';

import { IEmployee, NewEmployee } from './employee.model';

export const sampleWithRequiredData: IEmployee = {
  id: 7813,
};

export const sampleWithPartialData: IEmployee = {
  id: 37115,
  prenom: 'c Cambridgeshire asymmetric',
  email: 'Yves86@yahoo.fr',
  dateembauche: dayjs('2022-08-25T02:43'),
};

export const sampleWithFullData: IEmployee = {
  id: 29385,
  nom: 'internet de strategic',
  prenom: 'paradigm',
  email: 'Sauveur_Charpentier@hotmail.fr',
  numtel: 'Berkshire Stagiaire user-centric',
  dateembauche: dayjs('2022-08-24T21:44'),
};

export const sampleWithNewData: NewEmployee = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);

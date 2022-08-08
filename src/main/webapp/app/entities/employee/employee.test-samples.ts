import dayjs from 'dayjs/esm';

import { IEmployee, NewEmployee } from './employee.model';

export const sampleWithRequiredData: IEmployee = {
  id: 7813,
};

export const sampleWithPartialData: IEmployee = {
  id: 37115,
  prenom: 'c Cambridgeshire asymmetric',
  email: 'Yves86@yahoo.fr',
  dateembauche: dayjs('2022-08-08T04:17'),
};

export const sampleWithFullData: IEmployee = {
  id: 29385,
  nom: 'internet de strategic',
  prenom: 'paradigm',
  email: 'Sauveur_Charpentier@hotmail.fr',
  numtel: 'Berkshire Stagiaire user-centric',
  dateembauche: dayjs('2022-08-07T23:18'),
};

export const sampleWithNewData: NewEmployee = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);

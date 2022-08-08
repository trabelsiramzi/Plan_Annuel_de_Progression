import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IEntretien, NewEntretien } from '../entretien.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IEntretien for edit and NewEntretienFormGroupInput for create.
 */
type EntretienFormGroupInput = IEntretien | PartialWithRequiredKeyOf<NewEntretien>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IEntretien | NewEntretien> = Omit<T, 'dateentretient'> & {
  dateentretient?: string | null;
};

type EntretienFormRawValue = FormValueOf<IEntretien>;

type NewEntretienFormRawValue = FormValueOf<NewEntretien>;

type EntretienFormDefaults = Pick<NewEntretien, 'id' | 'dateentretient'>;

type EntretienFormGroupContent = {
  id: FormControl<EntretienFormRawValue['id'] | NewEntretien['id']>;
  dateentretient: FormControl<EntretienFormRawValue['dateentretient']>;
  resultat: FormControl<EntretienFormRawValue['resultat']>;
  confirmationresponsable: FormControl<EntretienFormRawValue['confirmationresponsable']>;
  confirmationsalarie: FormControl<EntretienFormRawValue['confirmationsalarie']>;
  responsable: FormControl<EntretienFormRawValue['responsable']>;
};

export type EntretienFormGroup = FormGroup<EntretienFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class EntretienFormService {
  createEntretienFormGroup(entretien: EntretienFormGroupInput = { id: null }): EntretienFormGroup {
    const entretienRawValue = this.convertEntretienToEntretienRawValue({
      ...this.getFormDefaults(),
      ...entretien,
    });
    return new FormGroup<EntretienFormGroupContent>({
      id: new FormControl(
        { value: entretienRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      dateentretient: new FormControl(entretienRawValue.dateentretient),
      resultat: new FormControl(entretienRawValue.resultat),
      confirmationresponsable: new FormControl(entretienRawValue.confirmationresponsable),
      confirmationsalarie: new FormControl(entretienRawValue.confirmationsalarie),
      responsable: new FormControl(entretienRawValue.responsable),
    });
  }

  getEntretien(form: EntretienFormGroup): IEntretien | NewEntretien {
    return this.convertEntretienRawValueToEntretien(form.getRawValue() as EntretienFormRawValue | NewEntretienFormRawValue);
  }

  resetForm(form: EntretienFormGroup, entretien: EntretienFormGroupInput): void {
    const entretienRawValue = this.convertEntretienToEntretienRawValue({ ...this.getFormDefaults(), ...entretien });
    form.reset(
      {
        ...entretienRawValue,
        id: { value: entretienRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): EntretienFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      dateentretient: currentTime,
    };
  }

  private convertEntretienRawValueToEntretien(rawEntretien: EntretienFormRawValue | NewEntretienFormRawValue): IEntretien | NewEntretien {
    return {
      ...rawEntretien,
      dateentretient: dayjs(rawEntretien.dateentretient, DATE_TIME_FORMAT),
    };
  }

  private convertEntretienToEntretienRawValue(
    entretien: IEntretien | (Partial<NewEntretien> & EntretienFormDefaults)
  ): EntretienFormRawValue | PartialWithRequiredKeyOf<NewEntretienFormRawValue> {
    return {
      ...entretien,
      dateentretient: entretien.dateentretient ? entretien.dateentretient.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}

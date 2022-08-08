import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IAffectation, NewAffectation } from '../affectation.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAffectation for edit and NewAffectationFormGroupInput for create.
 */
type AffectationFormGroupInput = IAffectation | PartialWithRequiredKeyOf<NewAffectation>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IAffectation | NewAffectation> = Omit<T, 'datedebut' | 'datefin'> & {
  datedebut?: string | null;
  datefin?: string | null;
};

type AffectationFormRawValue = FormValueOf<IAffectation>;

type NewAffectationFormRawValue = FormValueOf<NewAffectation>;

type AffectationFormDefaults = Pick<NewAffectation, 'id' | 'datedebut' | 'datefin'>;

type AffectationFormGroupContent = {
  id: FormControl<AffectationFormRawValue['id'] | NewAffectation['id']>;
  nomprojet: FormControl<AffectationFormRawValue['nomprojet']>;
  description: FormControl<AffectationFormRawValue['description']>;
  datedebut: FormControl<AffectationFormRawValue['datedebut']>;
  datefin: FormControl<AffectationFormRawValue['datefin']>;
  employee: FormControl<AffectationFormRawValue['employee']>;
};

export type AffectationFormGroup = FormGroup<AffectationFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AffectationFormService {
  createAffectationFormGroup(affectation: AffectationFormGroupInput = { id: null }): AffectationFormGroup {
    const affectationRawValue = this.convertAffectationToAffectationRawValue({
      ...this.getFormDefaults(),
      ...affectation,
    });
    return new FormGroup<AffectationFormGroupContent>({
      id: new FormControl(
        { value: affectationRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      nomprojet: new FormControl(affectationRawValue.nomprojet),
      description: new FormControl(affectationRawValue.description),
      datedebut: new FormControl(affectationRawValue.datedebut),
      datefin: new FormControl(affectationRawValue.datefin),
      employee: new FormControl(affectationRawValue.employee),
    });
  }

  getAffectation(form: AffectationFormGroup): IAffectation | NewAffectation {
    return this.convertAffectationRawValueToAffectation(form.getRawValue() as AffectationFormRawValue | NewAffectationFormRawValue);
  }

  resetForm(form: AffectationFormGroup, affectation: AffectationFormGroupInput): void {
    const affectationRawValue = this.convertAffectationToAffectationRawValue({ ...this.getFormDefaults(), ...affectation });
    form.reset(
      {
        ...affectationRawValue,
        id: { value: affectationRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): AffectationFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      datedebut: currentTime,
      datefin: currentTime,
    };
  }

  private convertAffectationRawValueToAffectation(
    rawAffectation: AffectationFormRawValue | NewAffectationFormRawValue
  ): IAffectation | NewAffectation {
    return {
      ...rawAffectation,
      datedebut: dayjs(rawAffectation.datedebut, DATE_TIME_FORMAT),
      datefin: dayjs(rawAffectation.datefin, DATE_TIME_FORMAT),
    };
  }

  private convertAffectationToAffectationRawValue(
    affectation: IAffectation | (Partial<NewAffectation> & AffectationFormDefaults)
  ): AffectationFormRawValue | PartialWithRequiredKeyOf<NewAffectationFormRawValue> {
    return {
      ...affectation,
      datedebut: affectation.datedebut ? affectation.datedebut.format(DATE_TIME_FORMAT) : undefined,
      datefin: affectation.datefin ? affectation.datefin.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}

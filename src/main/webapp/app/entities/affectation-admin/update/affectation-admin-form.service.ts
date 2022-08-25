import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IAffectationAdmin, NewAffectationAdmin } from '../affectation-admin.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAffectationAdmin for edit and NewAffectationAdminFormGroupInput for create.
 */
type AffectationAdminFormGroupInput = IAffectationAdmin | PartialWithRequiredKeyOf<NewAffectationAdmin>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IAffectationAdmin | NewAffectationAdmin> = Omit<T, 'datedebut' | 'datefin'> & {
  datedebut?: string | null;
  datefin?: string | null;
};

type AffectationAdminFormRawValue = FormValueOf<IAffectationAdmin>;

type NewAffectationAdminFormRawValue = FormValueOf<NewAffectationAdmin>;

type AffectationAdminFormDefaults = Pick<NewAffectationAdmin, 'id' | 'datedebut' | 'datefin'>;

type AffectationAdminFormGroupContent = {
  id: FormControl<AffectationAdminFormRawValue['id'] | NewAffectationAdmin['id']>;
  datedebut: FormControl<AffectationAdminFormRawValue['datedebut']>;
  datefin: FormControl<AffectationAdminFormRawValue['datefin']>;
};

export type AffectationAdminFormGroup = FormGroup<AffectationAdminFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AffectationAdminFormService {
  createAffectationAdminFormGroup(affectationAdmin: AffectationAdminFormGroupInput = { id: null }): AffectationAdminFormGroup {
    const affectationAdminRawValue = this.convertAffectationAdminToAffectationAdminRawValue({
      ...this.getFormDefaults(),
      ...affectationAdmin,
    });
    return new FormGroup<AffectationAdminFormGroupContent>({
      id: new FormControl(
        { value: affectationAdminRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      datedebut: new FormControl(affectationAdminRawValue.datedebut),
      datefin: new FormControl(affectationAdminRawValue.datefin),
    });
  }

  getAffectationAdmin(form: AffectationAdminFormGroup): IAffectationAdmin | NewAffectationAdmin {
    return this.convertAffectationAdminRawValueToAffectationAdmin(
      form.getRawValue() as AffectationAdminFormRawValue | NewAffectationAdminFormRawValue
    );
  }

  resetForm(form: AffectationAdminFormGroup, affectationAdmin: AffectationAdminFormGroupInput): void {
    const affectationAdminRawValue = this.convertAffectationAdminToAffectationAdminRawValue({
      ...this.getFormDefaults(),
      ...affectationAdmin,
    });
    form.reset(
      {
        ...affectationAdminRawValue,
        id: { value: affectationAdminRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): AffectationAdminFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      datedebut: currentTime,
      datefin: currentTime,
    };
  }

  private convertAffectationAdminRawValueToAffectationAdmin(
    rawAffectationAdmin: AffectationAdminFormRawValue | NewAffectationAdminFormRawValue
  ): IAffectationAdmin | NewAffectationAdmin {
    return {
      ...rawAffectationAdmin,
      datedebut: dayjs(rawAffectationAdmin.datedebut, DATE_TIME_FORMAT),
      datefin: dayjs(rawAffectationAdmin.datefin, DATE_TIME_FORMAT),
    };
  }

  private convertAffectationAdminToAffectationAdminRawValue(
    affectationAdmin: IAffectationAdmin | (Partial<NewAffectationAdmin> & AffectationAdminFormDefaults)
  ): AffectationAdminFormRawValue | PartialWithRequiredKeyOf<NewAffectationAdminFormRawValue> {
    return {
      ...affectationAdmin,
      datedebut: affectationAdmin.datedebut ? affectationAdmin.datedebut.format(DATE_TIME_FORMAT) : undefined,
      datefin: affectationAdmin.datefin ? affectationAdmin.datefin.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}

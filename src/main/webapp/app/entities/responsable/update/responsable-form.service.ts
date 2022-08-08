import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IResponsable, NewResponsable } from '../responsable.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IResponsable for edit and NewResponsableFormGroupInput for create.
 */
type ResponsableFormGroupInput = IResponsable | PartialWithRequiredKeyOf<NewResponsable>;

type ResponsableFormDefaults = Pick<NewResponsable, 'id'>;

type ResponsableFormGroupContent = {
  id: FormControl<IResponsable['id'] | NewResponsable['id']>;
  nommanager: FormControl<IResponsable['nommanager']>;
  nomteamlead: FormControl<IResponsable['nomteamlead']>;
};

export type ResponsableFormGroup = FormGroup<ResponsableFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ResponsableFormService {
  createResponsableFormGroup(responsable: ResponsableFormGroupInput = { id: null }): ResponsableFormGroup {
    const responsableRawValue = {
      ...this.getFormDefaults(),
      ...responsable,
    };
    return new FormGroup<ResponsableFormGroupContent>({
      id: new FormControl(
        { value: responsableRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      nommanager: new FormControl(responsableRawValue.nommanager),
      nomteamlead: new FormControl(responsableRawValue.nomteamlead),
    });
  }

  getResponsable(form: ResponsableFormGroup): IResponsable | NewResponsable {
    return form.getRawValue() as IResponsable | NewResponsable;
  }

  resetForm(form: ResponsableFormGroup, responsable: ResponsableFormGroupInput): void {
    const responsableRawValue = { ...this.getFormDefaults(), ...responsable };
    form.reset(
      {
        ...responsableRawValue,
        id: { value: responsableRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ResponsableFormDefaults {
    return {
      id: null,
    };
  }
}

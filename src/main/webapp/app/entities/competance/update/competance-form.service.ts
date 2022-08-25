import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ICompetance, NewCompetance } from '../competance.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICompetance for edit and NewCompetanceFormGroupInput for create.
 */
type CompetanceFormGroupInput = ICompetance | PartialWithRequiredKeyOf<NewCompetance>;

type CompetanceFormDefaults = Pick<NewCompetance, 'id'>;

type CompetanceFormGroupContent = {
  id: FormControl<ICompetance['id'] | NewCompetance['id']>;
  nomCompetance: FormControl<ICompetance['nomCompetance']>;
  description: FormControl<ICompetance['description']>;
  niveau: FormControl<ICompetance['niveau']>;
  affectation: FormControl<ICompetance['affectation']>;
};

export type CompetanceFormGroup = FormGroup<CompetanceFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CompetanceFormService {
  createCompetanceFormGroup(competance: CompetanceFormGroupInput = { id: null }): CompetanceFormGroup {
    const competanceRawValue = {
      ...this.getFormDefaults(),
      ...competance,
    };
    return new FormGroup<CompetanceFormGroupContent>({
      id: new FormControl(
        { value: competanceRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      nomCompetance: new FormControl(competanceRawValue.nomCompetance),
      description: new FormControl(competanceRawValue.description),
      niveau: new FormControl(competanceRawValue.niveau),
      affectation: new FormControl(competanceRawValue.affectation),
    });
  }

  getCompetance(form: CompetanceFormGroup): ICompetance | NewCompetance {
    return form.getRawValue() as ICompetance | NewCompetance;
  }

  resetForm(form: CompetanceFormGroup, competance: CompetanceFormGroupInput): void {
    const competanceRawValue = { ...this.getFormDefaults(), ...competance };
    form.reset(
      {
        ...competanceRawValue,
        id: { value: competanceRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): CompetanceFormDefaults {
    return {
      id: null,
    };
  }
}

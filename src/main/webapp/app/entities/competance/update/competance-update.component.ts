import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { CompetanceFormService, CompetanceFormGroup } from './competance-form.service';
import { ICompetance } from '../competance.model';
import { CompetanceService } from '../service/competance.service';
import { IAffectation } from 'app/entities/affectation/affectation.model';
import { AffectationService } from 'app/entities/affectation/service/affectation.service';

@Component({
  selector: 'jhi-competance-update',
  templateUrl: './competance-update.component.html',
})
export class CompetanceUpdateComponent implements OnInit {
  isSaving = false;
  competance: ICompetance | null = null;

  affectationsSharedCollection: IAffectation[] = [];

  editForm: CompetanceFormGroup = this.competanceFormService.createCompetanceFormGroup();

  constructor(
    protected competanceService: CompetanceService,
    protected competanceFormService: CompetanceFormService,
    protected affectationService: AffectationService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareAffectation = (o1: IAffectation | null, o2: IAffectation | null): boolean => this.affectationService.compareAffectation(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ competance }) => {
      this.competance = competance;
      if (competance) {
        this.updateForm(competance);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const competance = this.competanceFormService.getCompetance(this.editForm);
    if (competance.id !== null) {
      this.subscribeToSaveResponse(this.competanceService.update(competance));
    } else {
      this.subscribeToSaveResponse(this.competanceService.create(competance));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICompetance>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(competance: ICompetance): void {
    this.competance = competance;
    this.competanceFormService.resetForm(this.editForm, competance);

    this.affectationsSharedCollection = this.affectationService.addAffectationToCollectionIfMissing<IAffectation>(
      this.affectationsSharedCollection,
      competance.affectation
    );
  }

  protected loadRelationshipsOptions(): void {
    this.affectationService
      .query()
      .pipe(map((res: HttpResponse<IAffectation[]>) => res.body ?? []))
      .pipe(
        map((affectations: IAffectation[]) =>
          this.affectationService.addAffectationToCollectionIfMissing<IAffectation>(affectations, this.competance?.affectation)
        )
      )
      .subscribe((affectations: IAffectation[]) => (this.affectationsSharedCollection = affectations));
  }
}

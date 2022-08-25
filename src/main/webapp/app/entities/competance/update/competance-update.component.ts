import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { CompetanceFormService, CompetanceFormGroup } from './competance-form.service';
import { ICompetance } from '../competance.model';
import { CompetanceService } from '../service/competance.service';

@Component({
  selector: 'jhi-competance-update',
  templateUrl: './competance-update.component.html',
})
export class CompetanceUpdateComponent implements OnInit {
  isSaving = false;
  competance: ICompetance | null = null;

  editForm: CompetanceFormGroup = this.competanceFormService.createCompetanceFormGroup();

  constructor(
    protected competanceService: CompetanceService,
    protected competanceFormService: CompetanceFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ competance }) => {
      this.competance = competance;
      if (competance) {
        this.updateForm(competance);
      }
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
  }
}

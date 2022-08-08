import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ResponsableFormService, ResponsableFormGroup } from './responsable-form.service';
import { IResponsable } from '../responsable.model';
import { ResponsableService } from '../service/responsable.service';

@Component({
  selector: 'jhi-responsable-update',
  templateUrl: './responsable-update.component.html',
})
export class ResponsableUpdateComponent implements OnInit {
  isSaving = false;
  responsable: IResponsable | null = null;

  editForm: ResponsableFormGroup = this.responsableFormService.createResponsableFormGroup();

  constructor(
    protected responsableService: ResponsableService,
    protected responsableFormService: ResponsableFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ responsable }) => {
      this.responsable = responsable;
      if (responsable) {
        this.updateForm(responsable);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const responsable = this.responsableFormService.getResponsable(this.editForm);
    if (responsable.id !== null) {
      this.subscribeToSaveResponse(this.responsableService.update(responsable));
    } else {
      this.subscribeToSaveResponse(this.responsableService.create(responsable));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IResponsable>>): void {
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

  protected updateForm(responsable: IResponsable): void {
    this.responsable = responsable;
    this.responsableFormService.resetForm(this.editForm, responsable);
  }
}

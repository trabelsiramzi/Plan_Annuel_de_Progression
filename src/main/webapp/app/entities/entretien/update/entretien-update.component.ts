import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { EntretienFormService, EntretienFormGroup } from './entretien-form.service';
import { IEntretien } from '../entretien.model';
import { EntretienService } from '../service/entretien.service';
import { IResponsable } from 'app/entities/responsable/responsable.model';
import { ResponsableService } from 'app/entities/responsable/service/responsable.service';

@Component({
  selector: 'jhi-entretien-update',
  templateUrl: './entretien-update.component.html',
})
export class EntretienUpdateComponent implements OnInit {
  isSaving = false;
  entretien: IEntretien | null = null;

  responsablesSharedCollection: IResponsable[] = [];

  editForm: EntretienFormGroup = this.entretienFormService.createEntretienFormGroup();

  constructor(
    protected entretienService: EntretienService,
    protected entretienFormService: EntretienFormService,
    protected responsableService: ResponsableService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareResponsable = (o1: IResponsable | null, o2: IResponsable | null): boolean => this.responsableService.compareResponsable(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ entretien }) => {
      this.entretien = entretien;
      if (entretien) {
        this.updateForm(entretien);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const entretien = this.entretienFormService.getEntretien(this.editForm);
    if (entretien.id !== null) {
      this.subscribeToSaveResponse(this.entretienService.update(entretien));
    } else {
      this.subscribeToSaveResponse(this.entretienService.create(entretien));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEntretien>>): void {
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

  protected updateForm(entretien: IEntretien): void {
    this.entretien = entretien;
    this.entretienFormService.resetForm(this.editForm, entretien);

    this.responsablesSharedCollection = this.responsableService.addResponsableToCollectionIfMissing<IResponsable>(
      this.responsablesSharedCollection,
      entretien.responsable
    );
  }

  protected loadRelationshipsOptions(): void {
    this.responsableService
      .query()
      .pipe(map((res: HttpResponse<IResponsable[]>) => res.body ?? []))
      .pipe(
        map((responsables: IResponsable[]) =>
          this.responsableService.addResponsableToCollectionIfMissing<IResponsable>(responsables, this.entretien?.responsable)
        )
      )
      .subscribe((responsables: IResponsable[]) => (this.responsablesSharedCollection = responsables));
  }
}

import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { AffectationAdminFormService, AffectationAdminFormGroup } from './affectation-admin-form.service';
import { IAffectationAdmin } from '../affectation-admin.model';
import { AffectationAdminService } from '../service/affectation-admin.service';
import { IEtablissement } from 'app/entities/etablissement/etablissement.model';
import { EtablissementService } from 'app/entities/etablissement/service/etablissement.service';

@Component({
  selector: 'jhi-affectation-admin-update',
  templateUrl: './affectation-admin-update.component.html',
})
export class AffectationAdminUpdateComponent implements OnInit {
  isSaving = false;
  affectationAdmin: IAffectationAdmin | null = null;

  etablissementsSharedCollection: IEtablissement[] = [];

  editForm: AffectationAdminFormGroup = this.affectationAdminFormService.createAffectationAdminFormGroup();

  constructor(
    protected affectationAdminService: AffectationAdminService,
    protected affectationAdminFormService: AffectationAdminFormService,
    protected etablissementService: EtablissementService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareEtablissement = (o1: IEtablissement | null, o2: IEtablissement | null): boolean =>
    this.etablissementService.compareEtablissement(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ affectationAdmin }) => {
      this.affectationAdmin = affectationAdmin;
      if (affectationAdmin) {
        this.updateForm(affectationAdmin);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const affectationAdmin = this.affectationAdminFormService.getAffectationAdmin(this.editForm);
    if (affectationAdmin.id !== null) {
      this.subscribeToSaveResponse(this.affectationAdminService.update(affectationAdmin));
    } else {
      this.subscribeToSaveResponse(this.affectationAdminService.create(affectationAdmin));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAffectationAdmin>>): void {
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

  protected updateForm(affectationAdmin: IAffectationAdmin): void {
    this.affectationAdmin = affectationAdmin;
    this.affectationAdminFormService.resetForm(this.editForm, affectationAdmin);

    this.etablissementsSharedCollection = this.etablissementService.addEtablissementToCollectionIfMissing<IEtablissement>(
      this.etablissementsSharedCollection,
      affectationAdmin.etablissement
    );
  }

  protected loadRelationshipsOptions(): void {
    this.etablissementService
      .query()
      .pipe(map((res: HttpResponse<IEtablissement[]>) => res.body ?? []))
      .pipe(
        map((etablissements: IEtablissement[]) =>
          this.etablissementService.addEtablissementToCollectionIfMissing<IEtablissement>(
            etablissements,
            this.affectationAdmin?.etablissement
          )
        )
      )
      .subscribe((etablissements: IEtablissement[]) => (this.etablissementsSharedCollection = etablissements));
  }
}

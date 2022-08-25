import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { EtablissementFormService, EtablissementFormGroup } from './etablissement-form.service';
import { IEtablissement } from '../etablissement.model';
import { EtablissementService } from '../service/etablissement.service';
import { IAffectationAdmin } from 'app/entities/affectation-admin/affectation-admin.model';
import { AffectationAdminService } from 'app/entities/affectation-admin/service/affectation-admin.service';

@Component({
  selector: 'jhi-etablissement-update',
  templateUrl: './etablissement-update.component.html',
})
export class EtablissementUpdateComponent implements OnInit {
  isSaving = false;
  etablissement: IEtablissement | null = null;

  affectationAdminsSharedCollection: IAffectationAdmin[] = [];

  editForm: EtablissementFormGroup = this.etablissementFormService.createEtablissementFormGroup();

  constructor(
    protected etablissementService: EtablissementService,
    protected etablissementFormService: EtablissementFormService,
    protected affectationAdminService: AffectationAdminService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareAffectationAdmin = (o1: IAffectationAdmin | null, o2: IAffectationAdmin | null): boolean =>
    this.affectationAdminService.compareAffectationAdmin(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ etablissement }) => {
      this.etablissement = etablissement;
      if (etablissement) {
        this.updateForm(etablissement);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const etablissement = this.etablissementFormService.getEtablissement(this.editForm);
    if (etablissement.id !== null) {
      this.subscribeToSaveResponse(this.etablissementService.update(etablissement));
    } else {
      this.subscribeToSaveResponse(this.etablissementService.create(etablissement));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEtablissement>>): void {
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

  protected updateForm(etablissement: IEtablissement): void {
    this.etablissement = etablissement;
    this.etablissementFormService.resetForm(this.editForm, etablissement);

    this.affectationAdminsSharedCollection = this.affectationAdminService.addAffectationAdminToCollectionIfMissing<IAffectationAdmin>(
      this.affectationAdminsSharedCollection,
      etablissement.affectationAdmin
    );
  }

  protected loadRelationshipsOptions(): void {
    this.affectationAdminService
      .query()
      .pipe(map((res: HttpResponse<IAffectationAdmin[]>) => res.body ?? []))
      .pipe(
        map((affectationAdmins: IAffectationAdmin[]) =>
          this.affectationAdminService.addAffectationAdminToCollectionIfMissing<IAffectationAdmin>(
            affectationAdmins,
            this.etablissement?.affectationAdmin
          )
        )
      )
      .subscribe((affectationAdmins: IAffectationAdmin[]) => (this.affectationAdminsSharedCollection = affectationAdmins));
  }
}

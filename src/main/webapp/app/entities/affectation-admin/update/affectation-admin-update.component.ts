import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { AffectationAdminFormService, AffectationAdminFormGroup } from './affectation-admin-form.service';
import { IAffectationAdmin } from '../affectation-admin.model';
import { AffectationAdminService } from '../service/affectation-admin.service';

@Component({
  selector: 'jhi-affectation-admin-update',
  templateUrl: './affectation-admin-update.component.html',
})
export class AffectationAdminUpdateComponent implements OnInit {
  isSaving = false;
  affectationAdmin: IAffectationAdmin | null = null;

  editForm: AffectationAdminFormGroup = this.affectationAdminFormService.createAffectationAdminFormGroup();

  constructor(
    protected affectationAdminService: AffectationAdminService,
    protected affectationAdminFormService: AffectationAdminFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ affectationAdmin }) => {
      this.affectationAdmin = affectationAdmin;
      if (affectationAdmin) {
        this.updateForm(affectationAdmin);
      }
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
  }
}

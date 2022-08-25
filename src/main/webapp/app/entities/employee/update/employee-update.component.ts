import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { EmployeeFormService, EmployeeFormGroup } from './employee-form.service';
import { IEmployee } from '../employee.model';
import { EmployeeService } from '../service/employee.service';
import { IAffectation } from 'app/entities/affectation/affectation.model';
import { AffectationService } from 'app/entities/affectation/service/affectation.service';
import { IEtablissement } from 'app/entities/etablissement/etablissement.model';
import { EtablissementService } from 'app/entities/etablissement/service/etablissement.service';
import { IAffectationAdmin } from 'app/entities/affectation-admin/affectation-admin.model';
import { AffectationAdminService } from 'app/entities/affectation-admin/service/affectation-admin.service';

@Component({
  selector: 'jhi-employee-update',
  templateUrl: './employee-update.component.html',
})
export class EmployeeUpdateComponent implements OnInit {
  isSaving = false;
  employee: IEmployee | null = null;

  affectationsSharedCollection: IAffectation[] = [];
  etablissementsSharedCollection: IEtablissement[] = [];
  affectationAdminsSharedCollection: IAffectationAdmin[] = [];

  editForm: EmployeeFormGroup = this.employeeFormService.createEmployeeFormGroup();

  constructor(
    protected employeeService: EmployeeService,
    protected employeeFormService: EmployeeFormService,
    protected affectationService: AffectationService,
    protected etablissementService: EtablissementService,
    protected affectationAdminService: AffectationAdminService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareAffectation = (o1: IAffectation | null, o2: IAffectation | null): boolean => this.affectationService.compareAffectation(o1, o2);

  compareEtablissement = (o1: IEtablissement | null, o2: IEtablissement | null): boolean =>
    this.etablissementService.compareEtablissement(o1, o2);

  compareAffectationAdmin = (o1: IAffectationAdmin | null, o2: IAffectationAdmin | null): boolean =>
    this.affectationAdminService.compareAffectationAdmin(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ employee }) => {
      this.employee = employee;
      if (employee) {
        this.updateForm(employee);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const employee = this.employeeFormService.getEmployee(this.editForm);
    if (employee.id !== null) {
      this.subscribeToSaveResponse(this.employeeService.update(employee));
    } else {
      this.subscribeToSaveResponse(this.employeeService.create(employee));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEmployee>>): void {
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

  protected updateForm(employee: IEmployee): void {
    this.employee = employee;
    this.employeeFormService.resetForm(this.editForm, employee);

    this.affectationsSharedCollection = this.affectationService.addAffectationToCollectionIfMissing<IAffectation>(
      this.affectationsSharedCollection,
      employee.affectation
    );
    this.etablissementsSharedCollection = this.etablissementService.addEtablissementToCollectionIfMissing<IEtablissement>(
      this.etablissementsSharedCollection,
      employee.etablissement
    );
    this.affectationAdminsSharedCollection = this.affectationAdminService.addAffectationAdminToCollectionIfMissing<IAffectationAdmin>(
      this.affectationAdminsSharedCollection,
      employee.affectationAdmin
    );
  }

  protected loadRelationshipsOptions(): void {
    this.affectationService
      .query()
      .pipe(map((res: HttpResponse<IAffectation[]>) => res.body ?? []))
      .pipe(
        map((affectations: IAffectation[]) =>
          this.affectationService.addAffectationToCollectionIfMissing<IAffectation>(affectations, this.employee?.affectation)
        )
      )
      .subscribe((affectations: IAffectation[]) => (this.affectationsSharedCollection = affectations));

    this.etablissementService
      .query()
      .pipe(map((res: HttpResponse<IEtablissement[]>) => res.body ?? []))
      .pipe(
        map((etablissements: IEtablissement[]) =>
          this.etablissementService.addEtablissementToCollectionIfMissing<IEtablissement>(etablissements, this.employee?.etablissement)
        )
      )
      .subscribe((etablissements: IEtablissement[]) => (this.etablissementsSharedCollection = etablissements));

    this.affectationAdminService
      .query()
      .pipe(map((res: HttpResponse<IAffectationAdmin[]>) => res.body ?? []))
      .pipe(
        map((affectationAdmins: IAffectationAdmin[]) =>
          this.affectationAdminService.addAffectationAdminToCollectionIfMissing<IAffectationAdmin>(
            affectationAdmins,
            this.employee?.affectationAdmin
          )
        )
      )
      .subscribe((affectationAdmins: IAffectationAdmin[]) => (this.affectationAdminsSharedCollection = affectationAdmins));
  }
}

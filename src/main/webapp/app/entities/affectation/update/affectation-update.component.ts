import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { AffectationFormService, AffectationFormGroup } from './affectation-form.service';
import { IAffectation } from '../affectation.model';
import { AffectationService } from '../service/affectation.service';
import { IEmployee } from 'app/entities/employee/employee.model';
import { EmployeeService } from 'app/entities/employee/service/employee.service';

@Component({
  selector: 'jhi-affectation-update',
  templateUrl: './affectation-update.component.html',
})
export class AffectationUpdateComponent implements OnInit {
  isSaving = false;
  affectation: IAffectation | null = null;

  employeesSharedCollection: IEmployee[] = [];

  editForm: AffectationFormGroup = this.affectationFormService.createAffectationFormGroup();

  constructor(
    protected affectationService: AffectationService,
    protected affectationFormService: AffectationFormService,
    protected employeeService: EmployeeService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareEmployee = (o1: IEmployee | null, o2: IEmployee | null): boolean => this.employeeService.compareEmployee(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ affectation }) => {
      this.affectation = affectation;
      if (affectation) {
        this.updateForm(affectation);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const affectation = this.affectationFormService.getAffectation(this.editForm);
    if (affectation.id !== null) {
      this.subscribeToSaveResponse(this.affectationService.update(affectation));
    } else {
      this.subscribeToSaveResponse(this.affectationService.create(affectation));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAffectation>>): void {
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

  protected updateForm(affectation: IAffectation): void {
    this.affectation = affectation;
    this.affectationFormService.resetForm(this.editForm, affectation);

    this.employeesSharedCollection = this.employeeService.addEmployeeToCollectionIfMissing<IEmployee>(
      this.employeesSharedCollection,
      affectation.employee
    );
  }

  protected loadRelationshipsOptions(): void {
    this.employeeService
      .query()
      .pipe(map((res: HttpResponse<IEmployee[]>) => res.body ?? []))
      .pipe(
        map((employees: IEmployee[]) =>
          this.employeeService.addEmployeeToCollectionIfMissing<IEmployee>(employees, this.affectation?.employee)
        )
      )
      .subscribe((employees: IEmployee[]) => (this.employeesSharedCollection = employees));
  }
}

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
import { ICompetance } from 'app/entities/competance/competance.model';
import { CompetanceService } from 'app/entities/competance/service/competance.service';

@Component({
  selector: 'jhi-employee-update',
  templateUrl: './employee-update.component.html',
})
export class EmployeeUpdateComponent implements OnInit {
  isSaving = false;
  employee: IEmployee | null = null;

  employeesSharedCollection: IEmployee[] = [];
  affectationsSharedCollection: IAffectation[] = [];
  competancesSharedCollection: ICompetance[] = [];

  editForm: EmployeeFormGroup = this.employeeFormService.createEmployeeFormGroup();

  constructor(
    protected employeeService: EmployeeService,
    protected employeeFormService: EmployeeFormService,
    protected affectationService: AffectationService,
    protected competanceService: CompetanceService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareEmployee = (o1: IEmployee | null, o2: IEmployee | null): boolean => this.employeeService.compareEmployee(o1, o2);

  compareAffectation = (o1: IAffectation | null, o2: IAffectation | null): boolean => this.affectationService.compareAffectation(o1, o2);

  compareCompetance = (o1: ICompetance | null, o2: ICompetance | null): boolean => this.competanceService.compareCompetance(o1, o2);

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

    this.employeesSharedCollection = this.employeeService.addEmployeeToCollectionIfMissing<IEmployee>(
      this.employeesSharedCollection,
      employee.manager,
      employee.teamlead
    );
    this.affectationsSharedCollection = this.affectationService.addAffectationToCollectionIfMissing<IAffectation>(
      this.affectationsSharedCollection,
      ...(employee.affectations ?? [])
    );
    this.competancesSharedCollection = this.competanceService.addCompetanceToCollectionIfMissing<ICompetance>(
      this.competancesSharedCollection,
      ...(employee.competances ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.employeeService
      .query()
      .pipe(map((res: HttpResponse<IEmployee[]>) => res.body ?? []))
      .pipe(
        map((employees: IEmployee[]) =>
          this.employeeService.addEmployeeToCollectionIfMissing<IEmployee>(employees, this.employee?.manager, this.employee?.teamlead)
        )
      )
      .subscribe((employees: IEmployee[]) => (this.employeesSharedCollection = employees));

    this.affectationService
      .query()
      .pipe(map((res: HttpResponse<IAffectation[]>) => res.body ?? []))
      .pipe(
        map((affectations: IAffectation[]) =>
          this.affectationService.addAffectationToCollectionIfMissing<IAffectation>(affectations, ...(this.employee?.affectations ?? []))
        )
      )
      .subscribe((affectations: IAffectation[]) => (this.affectationsSharedCollection = affectations));

    this.competanceService
      .query()
      .pipe(map((res: HttpResponse<ICompetance[]>) => res.body ?? []))
      .pipe(
        map((competances: ICompetance[]) =>
          this.competanceService.addCompetanceToCollectionIfMissing<ICompetance>(competances, ...(this.employee?.competances ?? []))
        )
      )
      .subscribe((competances: ICompetance[]) => (this.competancesSharedCollection = competances));
  }
}

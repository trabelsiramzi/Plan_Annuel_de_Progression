import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { EntretienFormService, EntretienFormGroup } from './entretien-form.service';
import { IEntretien } from '../entretien.model';
import { EntretienService } from '../service/entretien.service';
import { IEmployee } from 'app/entities/employee/employee.model';
import { EmployeeService } from 'app/entities/employee/service/employee.service';

@Component({
  selector: 'jhi-entretien-update',
  templateUrl: './entretien-update.component.html',
})
export class EntretienUpdateComponent implements OnInit {
  isSaving = false;
  entretien: IEntretien | null = null;

  employeesSharedCollection: IEmployee[] = [];

  editForm: EntretienFormGroup = this.entretienFormService.createEntretienFormGroup();

  constructor(
    protected entretienService: EntretienService,
    protected entretienFormService: EntretienFormService,
    protected employeeService: EmployeeService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareEmployee = (o1: IEmployee | null, o2: IEmployee | null): boolean => this.employeeService.compareEmployee(o1, o2);

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

    this.employeesSharedCollection = this.employeeService.addEmployeeToCollectionIfMissing<IEmployee>(
      this.employeesSharedCollection,
      entretien.employee
    );
  }

  protected loadRelationshipsOptions(): void {
    this.employeeService
      .query()
      .pipe(map((res: HttpResponse<IEmployee[]>) => res.body ?? []))
      .pipe(
        map((employees: IEmployee[]) =>
          this.employeeService.addEmployeeToCollectionIfMissing<IEmployee>(employees, this.entretien?.employee)
        )
      )
      .subscribe((employees: IEmployee[]) => (this.employeesSharedCollection = employees));
  }
}

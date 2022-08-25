import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { EntretienFormService } from './entretien-form.service';
import { EntretienService } from '../service/entretien.service';
import { IEntretien } from '../entretien.model';
import { IEmployee } from 'app/entities/employee/employee.model';
import { EmployeeService } from 'app/entities/employee/service/employee.service';

import { EntretienUpdateComponent } from './entretien-update.component';

describe('Entretien Management Update Component', () => {
  let comp: EntretienUpdateComponent;
  let fixture: ComponentFixture<EntretienUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let entretienFormService: EntretienFormService;
  let entretienService: EntretienService;
  let employeeService: EmployeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [EntretienUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(EntretienUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EntretienUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    entretienFormService = TestBed.inject(EntretienFormService);
    entretienService = TestBed.inject(EntretienService);
    employeeService = TestBed.inject(EmployeeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Employee query and add missing value', () => {
      const entretien: IEntretien = { id: 456 };
      const employee: IEmployee = { id: 4060 };
      entretien.employee = employee;

      const employeeCollection: IEmployee[] = [{ id: 4081 }];
      jest.spyOn(employeeService, 'query').mockReturnValue(of(new HttpResponse({ body: employeeCollection })));
      const additionalEmployees = [employee];
      const expectedCollection: IEmployee[] = [...additionalEmployees, ...employeeCollection];
      jest.spyOn(employeeService, 'addEmployeeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ entretien });
      comp.ngOnInit();

      expect(employeeService.query).toHaveBeenCalled();
      expect(employeeService.addEmployeeToCollectionIfMissing).toHaveBeenCalledWith(
        employeeCollection,
        ...additionalEmployees.map(expect.objectContaining)
      );
      expect(comp.employeesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const entretien: IEntretien = { id: 456 };
      const employee: IEmployee = { id: 47587 };
      entretien.employee = employee;

      activatedRoute.data = of({ entretien });
      comp.ngOnInit();

      expect(comp.employeesSharedCollection).toContain(employee);
      expect(comp.entretien).toEqual(entretien);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEntretien>>();
      const entretien = { id: 123 };
      jest.spyOn(entretienFormService, 'getEntretien').mockReturnValue(entretien);
      jest.spyOn(entretienService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ entretien });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: entretien }));
      saveSubject.complete();

      // THEN
      expect(entretienFormService.getEntretien).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(entretienService.update).toHaveBeenCalledWith(expect.objectContaining(entretien));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEntretien>>();
      const entretien = { id: 123 };
      jest.spyOn(entretienFormService, 'getEntretien').mockReturnValue({ id: null });
      jest.spyOn(entretienService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ entretien: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: entretien }));
      saveSubject.complete();

      // THEN
      expect(entretienFormService.getEntretien).toHaveBeenCalled();
      expect(entretienService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEntretien>>();
      const entretien = { id: 123 };
      jest.spyOn(entretienService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ entretien });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(entretienService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareEmployee', () => {
      it('Should forward to employeeService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(employeeService, 'compareEmployee');
        comp.compareEmployee(entity, entity2);
        expect(employeeService.compareEmployee).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});

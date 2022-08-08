import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AffectationFormService } from './affectation-form.service';
import { AffectationService } from '../service/affectation.service';
import { IAffectation } from '../affectation.model';
import { IEmployee } from 'app/entities/employee/employee.model';
import { EmployeeService } from 'app/entities/employee/service/employee.service';

import { AffectationUpdateComponent } from './affectation-update.component';

describe('Affectation Management Update Component', () => {
  let comp: AffectationUpdateComponent;
  let fixture: ComponentFixture<AffectationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let affectationFormService: AffectationFormService;
  let affectationService: AffectationService;
  let employeeService: EmployeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [AffectationUpdateComponent],
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
      .overrideTemplate(AffectationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AffectationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    affectationFormService = TestBed.inject(AffectationFormService);
    affectationService = TestBed.inject(AffectationService);
    employeeService = TestBed.inject(EmployeeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Employee query and add missing value', () => {
      const affectation: IAffectation = { id: 456 };
      const employee: IEmployee = { id: 10776 };
      affectation.employee = employee;

      const employeeCollection: IEmployee[] = [{ id: 40700 }];
      jest.spyOn(employeeService, 'query').mockReturnValue(of(new HttpResponse({ body: employeeCollection })));
      const additionalEmployees = [employee];
      const expectedCollection: IEmployee[] = [...additionalEmployees, ...employeeCollection];
      jest.spyOn(employeeService, 'addEmployeeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ affectation });
      comp.ngOnInit();

      expect(employeeService.query).toHaveBeenCalled();
      expect(employeeService.addEmployeeToCollectionIfMissing).toHaveBeenCalledWith(
        employeeCollection,
        ...additionalEmployees.map(expect.objectContaining)
      );
      expect(comp.employeesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const affectation: IAffectation = { id: 456 };
      const employee: IEmployee = { id: 81278 };
      affectation.employee = employee;

      activatedRoute.data = of({ affectation });
      comp.ngOnInit();

      expect(comp.employeesSharedCollection).toContain(employee);
      expect(comp.affectation).toEqual(affectation);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAffectation>>();
      const affectation = { id: 123 };
      jest.spyOn(affectationFormService, 'getAffectation').mockReturnValue(affectation);
      jest.spyOn(affectationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ affectation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: affectation }));
      saveSubject.complete();

      // THEN
      expect(affectationFormService.getAffectation).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(affectationService.update).toHaveBeenCalledWith(expect.objectContaining(affectation));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAffectation>>();
      const affectation = { id: 123 };
      jest.spyOn(affectationFormService, 'getAffectation').mockReturnValue({ id: null });
      jest.spyOn(affectationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ affectation: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: affectation }));
      saveSubject.complete();

      // THEN
      expect(affectationFormService.getAffectation).toHaveBeenCalled();
      expect(affectationService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAffectation>>();
      const affectation = { id: 123 };
      jest.spyOn(affectationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ affectation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(affectationService.update).toHaveBeenCalled();
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

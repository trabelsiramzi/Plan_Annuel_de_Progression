import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { EmployeeFormService } from './employee-form.service';
import { EmployeeService } from '../service/employee.service';
import { IEmployee } from '../employee.model';
import { IAffectation } from 'app/entities/affectation/affectation.model';
import { AffectationService } from 'app/entities/affectation/service/affectation.service';
import { ICompetance } from 'app/entities/competance/competance.model';
import { CompetanceService } from 'app/entities/competance/service/competance.service';

import { EmployeeUpdateComponent } from './employee-update.component';

describe('Employee Management Update Component', () => {
  let comp: EmployeeUpdateComponent;
  let fixture: ComponentFixture<EmployeeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let employeeFormService: EmployeeFormService;
  let employeeService: EmployeeService;
  let affectationService: AffectationService;
  let competanceService: CompetanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [EmployeeUpdateComponent],
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
      .overrideTemplate(EmployeeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EmployeeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    employeeFormService = TestBed.inject(EmployeeFormService);
    employeeService = TestBed.inject(EmployeeService);
    affectationService = TestBed.inject(AffectationService);
    competanceService = TestBed.inject(CompetanceService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Employee query and add missing value', () => {
      const employee: IEmployee = { id: 456 };
      const manager: IEmployee = { id: 4374 };
      employee.manager = manager;
      const teamlead: IEmployee = { id: 10177 };
      employee.teamlead = teamlead;

      const employeeCollection: IEmployee[] = [{ id: 79320 }];
      jest.spyOn(employeeService, 'query').mockReturnValue(of(new HttpResponse({ body: employeeCollection })));
      const additionalEmployees = [manager, teamlead];
      const expectedCollection: IEmployee[] = [...additionalEmployees, ...employeeCollection];
      jest.spyOn(employeeService, 'addEmployeeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ employee });
      comp.ngOnInit();

      expect(employeeService.query).toHaveBeenCalled();
      expect(employeeService.addEmployeeToCollectionIfMissing).toHaveBeenCalledWith(
        employeeCollection,
        ...additionalEmployees.map(expect.objectContaining)
      );
      expect(comp.employeesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Affectation query and add missing value', () => {
      const employee: IEmployee = { id: 456 };
      const affectations: IAffectation[] = [{ id: 22290 }];
      employee.affectations = affectations;

      const affectationCollection: IAffectation[] = [{ id: 89246 }];
      jest.spyOn(affectationService, 'query').mockReturnValue(of(new HttpResponse({ body: affectationCollection })));
      const additionalAffectations = [...affectations];
      const expectedCollection: IAffectation[] = [...additionalAffectations, ...affectationCollection];
      jest.spyOn(affectationService, 'addAffectationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ employee });
      comp.ngOnInit();

      expect(affectationService.query).toHaveBeenCalled();
      expect(affectationService.addAffectationToCollectionIfMissing).toHaveBeenCalledWith(
        affectationCollection,
        ...additionalAffectations.map(expect.objectContaining)
      );
      expect(comp.affectationsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Competance query and add missing value', () => {
      const employee: IEmployee = { id: 456 };
      const competances: ICompetance[] = [{ id: 64079 }];
      employee.competances = competances;

      const competanceCollection: ICompetance[] = [{ id: 81838 }];
      jest.spyOn(competanceService, 'query').mockReturnValue(of(new HttpResponse({ body: competanceCollection })));
      const additionalCompetances = [...competances];
      const expectedCollection: ICompetance[] = [...additionalCompetances, ...competanceCollection];
      jest.spyOn(competanceService, 'addCompetanceToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ employee });
      comp.ngOnInit();

      expect(competanceService.query).toHaveBeenCalled();
      expect(competanceService.addCompetanceToCollectionIfMissing).toHaveBeenCalledWith(
        competanceCollection,
        ...additionalCompetances.map(expect.objectContaining)
      );
      expect(comp.competancesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const employee: IEmployee = { id: 456 };
      const manager: IEmployee = { id: 70848 };
      employee.manager = manager;
      const teamlead: IEmployee = { id: 95148 };
      employee.teamlead = teamlead;
      const affectation: IAffectation = { id: 69891 };
      employee.affectations = [affectation];
      const competance: ICompetance = { id: 37580 };
      employee.competances = [competance];

      activatedRoute.data = of({ employee });
      comp.ngOnInit();

      expect(comp.employeesSharedCollection).toContain(manager);
      expect(comp.employeesSharedCollection).toContain(teamlead);
      expect(comp.affectationsSharedCollection).toContain(affectation);
      expect(comp.competancesSharedCollection).toContain(competance);
      expect(comp.employee).toEqual(employee);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEmployee>>();
      const employee = { id: 123 };
      jest.spyOn(employeeFormService, 'getEmployee').mockReturnValue(employee);
      jest.spyOn(employeeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ employee });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: employee }));
      saveSubject.complete();

      // THEN
      expect(employeeFormService.getEmployee).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(employeeService.update).toHaveBeenCalledWith(expect.objectContaining(employee));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEmployee>>();
      const employee = { id: 123 };
      jest.spyOn(employeeFormService, 'getEmployee').mockReturnValue({ id: null });
      jest.spyOn(employeeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ employee: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: employee }));
      saveSubject.complete();

      // THEN
      expect(employeeFormService.getEmployee).toHaveBeenCalled();
      expect(employeeService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEmployee>>();
      const employee = { id: 123 };
      jest.spyOn(employeeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ employee });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(employeeService.update).toHaveBeenCalled();
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

    describe('compareAffectation', () => {
      it('Should forward to affectationService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(affectationService, 'compareAffectation');
        comp.compareAffectation(entity, entity2);
        expect(affectationService.compareAffectation).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareCompetance', () => {
      it('Should forward to competanceService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(competanceService, 'compareCompetance');
        comp.compareCompetance(entity, entity2);
        expect(competanceService.compareCompetance).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});

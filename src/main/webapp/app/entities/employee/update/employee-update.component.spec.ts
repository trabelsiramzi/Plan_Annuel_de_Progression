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
import { IEtablissement } from 'app/entities/etablissement/etablissement.model';
import { EtablissementService } from 'app/entities/etablissement/service/etablissement.service';
import { IAffectationAdmin } from 'app/entities/affectation-admin/affectation-admin.model';
import { AffectationAdminService } from 'app/entities/affectation-admin/service/affectation-admin.service';

import { EmployeeUpdateComponent } from './employee-update.component';

describe('Employee Management Update Component', () => {
  let comp: EmployeeUpdateComponent;
  let fixture: ComponentFixture<EmployeeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let employeeFormService: EmployeeFormService;
  let employeeService: EmployeeService;
  let affectationService: AffectationService;
  let etablissementService: EtablissementService;
  let affectationAdminService: AffectationAdminService;

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
    etablissementService = TestBed.inject(EtablissementService);
    affectationAdminService = TestBed.inject(AffectationAdminService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Affectation query and add missing value', () => {
      const employee: IEmployee = { id: 456 };
      const affectation: IAffectation = { id: 22290 };
      employee.affectation = affectation;

      const affectationCollection: IAffectation[] = [{ id: 89246 }];
      jest.spyOn(affectationService, 'query').mockReturnValue(of(new HttpResponse({ body: affectationCollection })));
      const additionalAffectations = [affectation];
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

    it('Should call Etablissement query and add missing value', () => {
      const employee: IEmployee = { id: 456 };
      const etablissement: IEtablissement = { id: 18678 };
      employee.etablissement = etablissement;

      const etablissementCollection: IEtablissement[] = [{ id: 98544 }];
      jest.spyOn(etablissementService, 'query').mockReturnValue(of(new HttpResponse({ body: etablissementCollection })));
      const additionalEtablissements = [etablissement];
      const expectedCollection: IEtablissement[] = [...additionalEtablissements, ...etablissementCollection];
      jest.spyOn(etablissementService, 'addEtablissementToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ employee });
      comp.ngOnInit();

      expect(etablissementService.query).toHaveBeenCalled();
      expect(etablissementService.addEtablissementToCollectionIfMissing).toHaveBeenCalledWith(
        etablissementCollection,
        ...additionalEtablissements.map(expect.objectContaining)
      );
      expect(comp.etablissementsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call AffectationAdmin query and add missing value', () => {
      const employee: IEmployee = { id: 456 };
      const affectationAdmin: IAffectationAdmin = { id: 52198 };
      employee.affectationAdmin = affectationAdmin;

      const affectationAdminCollection: IAffectationAdmin[] = [{ id: 75298 }];
      jest.spyOn(affectationAdminService, 'query').mockReturnValue(of(new HttpResponse({ body: affectationAdminCollection })));
      const additionalAffectationAdmins = [affectationAdmin];
      const expectedCollection: IAffectationAdmin[] = [...additionalAffectationAdmins, ...affectationAdminCollection];
      jest.spyOn(affectationAdminService, 'addAffectationAdminToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ employee });
      comp.ngOnInit();

      expect(affectationAdminService.query).toHaveBeenCalled();
      expect(affectationAdminService.addAffectationAdminToCollectionIfMissing).toHaveBeenCalledWith(
        affectationAdminCollection,
        ...additionalAffectationAdmins.map(expect.objectContaining)
      );
      expect(comp.affectationAdminsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const employee: IEmployee = { id: 456 };
      const affectation: IAffectation = { id: 69891 };
      employee.affectation = affectation;
      const etablissement: IEtablissement = { id: 23151 };
      employee.etablissement = etablissement;
      const affectationAdmin: IAffectationAdmin = { id: 66897 };
      employee.affectationAdmin = affectationAdmin;

      activatedRoute.data = of({ employee });
      comp.ngOnInit();

      expect(comp.affectationsSharedCollection).toContain(affectation);
      expect(comp.etablissementsSharedCollection).toContain(etablissement);
      expect(comp.affectationAdminsSharedCollection).toContain(affectationAdmin);
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
    describe('compareAffectation', () => {
      it('Should forward to affectationService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(affectationService, 'compareAffectation');
        comp.compareAffectation(entity, entity2);
        expect(affectationService.compareAffectation).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareEtablissement', () => {
      it('Should forward to etablissementService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(etablissementService, 'compareEtablissement');
        comp.compareEtablissement(entity, entity2);
        expect(etablissementService.compareEtablissement).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareAffectationAdmin', () => {
      it('Should forward to affectationAdminService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(affectationAdminService, 'compareAffectationAdmin');
        comp.compareAffectationAdmin(entity, entity2);
        expect(affectationAdminService.compareAffectationAdmin).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});

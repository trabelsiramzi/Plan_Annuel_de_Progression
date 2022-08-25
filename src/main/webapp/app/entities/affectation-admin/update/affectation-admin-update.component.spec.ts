import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AffectationAdminFormService } from './affectation-admin-form.service';
import { AffectationAdminService } from '../service/affectation-admin.service';
import { IAffectationAdmin } from '../affectation-admin.model';

import { AffectationAdminUpdateComponent } from './affectation-admin-update.component';

describe('AffectationAdmin Management Update Component', () => {
  let comp: AffectationAdminUpdateComponent;
  let fixture: ComponentFixture<AffectationAdminUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let affectationAdminFormService: AffectationAdminFormService;
  let affectationAdminService: AffectationAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [AffectationAdminUpdateComponent],
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
      .overrideTemplate(AffectationAdminUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AffectationAdminUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    affectationAdminFormService = TestBed.inject(AffectationAdminFormService);
    affectationAdminService = TestBed.inject(AffectationAdminService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const affectationAdmin: IAffectationAdmin = { id: 456 };

      activatedRoute.data = of({ affectationAdmin });
      comp.ngOnInit();

      expect(comp.affectationAdmin).toEqual(affectationAdmin);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAffectationAdmin>>();
      const affectationAdmin = { id: 123 };
      jest.spyOn(affectationAdminFormService, 'getAffectationAdmin').mockReturnValue(affectationAdmin);
      jest.spyOn(affectationAdminService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ affectationAdmin });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: affectationAdmin }));
      saveSubject.complete();

      // THEN
      expect(affectationAdminFormService.getAffectationAdmin).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(affectationAdminService.update).toHaveBeenCalledWith(expect.objectContaining(affectationAdmin));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAffectationAdmin>>();
      const affectationAdmin = { id: 123 };
      jest.spyOn(affectationAdminFormService, 'getAffectationAdmin').mockReturnValue({ id: null });
      jest.spyOn(affectationAdminService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ affectationAdmin: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: affectationAdmin }));
      saveSubject.complete();

      // THEN
      expect(affectationAdminFormService.getAffectationAdmin).toHaveBeenCalled();
      expect(affectationAdminService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAffectationAdmin>>();
      const affectationAdmin = { id: 123 };
      jest.spyOn(affectationAdminService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ affectationAdmin });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(affectationAdminService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});

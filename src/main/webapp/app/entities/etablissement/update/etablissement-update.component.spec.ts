import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { EtablissementFormService } from './etablissement-form.service';
import { EtablissementService } from '../service/etablissement.service';
import { IEtablissement } from '../etablissement.model';
import { IAffectationAdmin } from 'app/entities/affectation-admin/affectation-admin.model';
import { AffectationAdminService } from 'app/entities/affectation-admin/service/affectation-admin.service';

import { EtablissementUpdateComponent } from './etablissement-update.component';

describe('Etablissement Management Update Component', () => {
  let comp: EtablissementUpdateComponent;
  let fixture: ComponentFixture<EtablissementUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let etablissementFormService: EtablissementFormService;
  let etablissementService: EtablissementService;
  let affectationAdminService: AffectationAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [EtablissementUpdateComponent],
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
      .overrideTemplate(EtablissementUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EtablissementUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    etablissementFormService = TestBed.inject(EtablissementFormService);
    etablissementService = TestBed.inject(EtablissementService);
    affectationAdminService = TestBed.inject(AffectationAdminService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call AffectationAdmin query and add missing value', () => {
      const etablissement: IEtablissement = { id: 456 };
      const manager: IAffectationAdmin = { id: 23996 };
      etablissement.manager = manager;
      const teamlead: IAffectationAdmin = { id: 80391 };
      etablissement.teamlead = teamlead;

      const affectationAdminCollection: IAffectationAdmin[] = [{ id: 66449 }];
      jest.spyOn(affectationAdminService, 'query').mockReturnValue(of(new HttpResponse({ body: affectationAdminCollection })));
      const additionalAffectationAdmins = [manager, teamlead];
      const expectedCollection: IAffectationAdmin[] = [...additionalAffectationAdmins, ...affectationAdminCollection];
      jest.spyOn(affectationAdminService, 'addAffectationAdminToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ etablissement });
      comp.ngOnInit();

      expect(affectationAdminService.query).toHaveBeenCalled();
      expect(affectationAdminService.addAffectationAdminToCollectionIfMissing).toHaveBeenCalledWith(
        affectationAdminCollection,
        ...additionalAffectationAdmins.map(expect.objectContaining)
      );
      expect(comp.affectationAdminsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const etablissement: IEtablissement = { id: 456 };
      const manager: IAffectationAdmin = { id: 80114 };
      etablissement.manager = manager;
      const teamlead: IAffectationAdmin = { id: 59493 };
      etablissement.teamlead = teamlead;

      activatedRoute.data = of({ etablissement });
      comp.ngOnInit();

      expect(comp.affectationAdminsSharedCollection).toContain(manager);
      expect(comp.affectationAdminsSharedCollection).toContain(teamlead);
      expect(comp.etablissement).toEqual(etablissement);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEtablissement>>();
      const etablissement = { id: 123 };
      jest.spyOn(etablissementFormService, 'getEtablissement').mockReturnValue(etablissement);
      jest.spyOn(etablissementService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ etablissement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: etablissement }));
      saveSubject.complete();

      // THEN
      expect(etablissementFormService.getEtablissement).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(etablissementService.update).toHaveBeenCalledWith(expect.objectContaining(etablissement));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEtablissement>>();
      const etablissement = { id: 123 };
      jest.spyOn(etablissementFormService, 'getEtablissement').mockReturnValue({ id: null });
      jest.spyOn(etablissementService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ etablissement: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: etablissement }));
      saveSubject.complete();

      // THEN
      expect(etablissementFormService.getEtablissement).toHaveBeenCalled();
      expect(etablissementService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEtablissement>>();
      const etablissement = { id: 123 };
      jest.spyOn(etablissementService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ etablissement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(etablissementService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
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

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
import { IProjet } from 'app/entities/projet/projet.model';
import { ProjetService } from 'app/entities/projet/service/projet.service';

import { AffectationUpdateComponent } from './affectation-update.component';

describe('Affectation Management Update Component', () => {
  let comp: AffectationUpdateComponent;
  let fixture: ComponentFixture<AffectationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let affectationFormService: AffectationFormService;
  let affectationService: AffectationService;
  let projetService: ProjetService;

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
    projetService = TestBed.inject(ProjetService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Projet query and add missing value', () => {
      const affectation: IAffectation = { id: 456 };
      const projet: IProjet = { id: 95642 };
      affectation.projet = projet;

      const projetCollection: IProjet[] = [{ id: 19804 }];
      jest.spyOn(projetService, 'query').mockReturnValue(of(new HttpResponse({ body: projetCollection })));
      const additionalProjets = [projet];
      const expectedCollection: IProjet[] = [...additionalProjets, ...projetCollection];
      jest.spyOn(projetService, 'addProjetToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ affectation });
      comp.ngOnInit();

      expect(projetService.query).toHaveBeenCalled();
      expect(projetService.addProjetToCollectionIfMissing).toHaveBeenCalledWith(
        projetCollection,
        ...additionalProjets.map(expect.objectContaining)
      );
      expect(comp.projetsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const affectation: IAffectation = { id: 456 };
      const projet: IProjet = { id: 67724 };
      affectation.projet = projet;

      activatedRoute.data = of({ affectation });
      comp.ngOnInit();

      expect(comp.projetsSharedCollection).toContain(projet);
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
    describe('compareProjet', () => {
      it('Should forward to projetService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(projetService, 'compareProjet');
        comp.compareProjet(entity, entity2);
        expect(projetService.compareProjet).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});

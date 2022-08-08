import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ProjetFormService } from './projet-form.service';
import { ProjetService } from '../service/projet.service';
import { IProjet } from '../projet.model';
import { IAffectation } from 'app/entities/affectation/affectation.model';
import { AffectationService } from 'app/entities/affectation/service/affectation.service';

import { ProjetUpdateComponent } from './projet-update.component';

describe('Projet Management Update Component', () => {
  let comp: ProjetUpdateComponent;
  let fixture: ComponentFixture<ProjetUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let projetFormService: ProjetFormService;
  let projetService: ProjetService;
  let affectationService: AffectationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ProjetUpdateComponent],
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
      .overrideTemplate(ProjetUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProjetUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    projetFormService = TestBed.inject(ProjetFormService);
    projetService = TestBed.inject(ProjetService);
    affectationService = TestBed.inject(AffectationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Affectation query and add missing value', () => {
      const projet: IProjet = { id: 456 };
      const nomprojet: IAffectation = { id: 93365 };
      projet.nomprojet = nomprojet;

      const affectationCollection: IAffectation[] = [{ id: 33187 }];
      jest.spyOn(affectationService, 'query').mockReturnValue(of(new HttpResponse({ body: affectationCollection })));
      const additionalAffectations = [nomprojet];
      const expectedCollection: IAffectation[] = [...additionalAffectations, ...affectationCollection];
      jest.spyOn(affectationService, 'addAffectationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ projet });
      comp.ngOnInit();

      expect(affectationService.query).toHaveBeenCalled();
      expect(affectationService.addAffectationToCollectionIfMissing).toHaveBeenCalledWith(
        affectationCollection,
        ...additionalAffectations.map(expect.objectContaining)
      );
      expect(comp.affectationsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const projet: IProjet = { id: 456 };
      const nomprojet: IAffectation = { id: 13345 };
      projet.nomprojet = nomprojet;

      activatedRoute.data = of({ projet });
      comp.ngOnInit();

      expect(comp.affectationsSharedCollection).toContain(nomprojet);
      expect(comp.projet).toEqual(projet);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProjet>>();
      const projet = { id: 123 };
      jest.spyOn(projetFormService, 'getProjet').mockReturnValue(projet);
      jest.spyOn(projetService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ projet });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: projet }));
      saveSubject.complete();

      // THEN
      expect(projetFormService.getProjet).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(projetService.update).toHaveBeenCalledWith(expect.objectContaining(projet));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProjet>>();
      const projet = { id: 123 };
      jest.spyOn(projetFormService, 'getProjet').mockReturnValue({ id: null });
      jest.spyOn(projetService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ projet: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: projet }));
      saveSubject.complete();

      // THEN
      expect(projetFormService.getProjet).toHaveBeenCalled();
      expect(projetService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProjet>>();
      const projet = { id: 123 };
      jest.spyOn(projetService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ projet });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(projetService.update).toHaveBeenCalled();
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
  });
});

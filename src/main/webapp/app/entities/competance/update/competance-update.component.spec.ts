import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CompetanceFormService } from './competance-form.service';
import { CompetanceService } from '../service/competance.service';
import { ICompetance } from '../competance.model';
import { IAffectation } from 'app/entities/affectation/affectation.model';
import { AffectationService } from 'app/entities/affectation/service/affectation.service';

import { CompetanceUpdateComponent } from './competance-update.component';

describe('Competance Management Update Component', () => {
  let comp: CompetanceUpdateComponent;
  let fixture: ComponentFixture<CompetanceUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let competanceFormService: CompetanceFormService;
  let competanceService: CompetanceService;
  let affectationService: AffectationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CompetanceUpdateComponent],
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
      .overrideTemplate(CompetanceUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CompetanceUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    competanceFormService = TestBed.inject(CompetanceFormService);
    competanceService = TestBed.inject(CompetanceService);
    affectationService = TestBed.inject(AffectationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Affectation query and add missing value', () => {
      const competance: ICompetance = { id: 456 };
      const affectation: IAffectation = { id: 33051 };
      competance.affectation = affectation;

      const affectationCollection: IAffectation[] = [{ id: 68863 }];
      jest.spyOn(affectationService, 'query').mockReturnValue(of(new HttpResponse({ body: affectationCollection })));
      const additionalAffectations = [affectation];
      const expectedCollection: IAffectation[] = [...additionalAffectations, ...affectationCollection];
      jest.spyOn(affectationService, 'addAffectationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ competance });
      comp.ngOnInit();

      expect(affectationService.query).toHaveBeenCalled();
      expect(affectationService.addAffectationToCollectionIfMissing).toHaveBeenCalledWith(
        affectationCollection,
        ...additionalAffectations.map(expect.objectContaining)
      );
      expect(comp.affectationsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const competance: ICompetance = { id: 456 };
      const affectation: IAffectation = { id: 40003 };
      competance.affectation = affectation;

      activatedRoute.data = of({ competance });
      comp.ngOnInit();

      expect(comp.affectationsSharedCollection).toContain(affectation);
      expect(comp.competance).toEqual(competance);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICompetance>>();
      const competance = { id: 123 };
      jest.spyOn(competanceFormService, 'getCompetance').mockReturnValue(competance);
      jest.spyOn(competanceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ competance });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: competance }));
      saveSubject.complete();

      // THEN
      expect(competanceFormService.getCompetance).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(competanceService.update).toHaveBeenCalledWith(expect.objectContaining(competance));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICompetance>>();
      const competance = { id: 123 };
      jest.spyOn(competanceFormService, 'getCompetance').mockReturnValue({ id: null });
      jest.spyOn(competanceService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ competance: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: competance }));
      saveSubject.complete();

      // THEN
      expect(competanceFormService.getCompetance).toHaveBeenCalled();
      expect(competanceService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICompetance>>();
      const competance = { id: 123 };
      jest.spyOn(competanceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ competance });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(competanceService.update).toHaveBeenCalled();
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

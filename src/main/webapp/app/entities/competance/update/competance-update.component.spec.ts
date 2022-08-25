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

import { CompetanceUpdateComponent } from './competance-update.component';

describe('Competance Management Update Component', () => {
  let comp: CompetanceUpdateComponent;
  let fixture: ComponentFixture<CompetanceUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let competanceFormService: CompetanceFormService;
  let competanceService: CompetanceService;

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

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const competance: ICompetance = { id: 456 };

      activatedRoute.data = of({ competance });
      comp.ngOnInit();

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
});

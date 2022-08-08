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
import { IResponsable } from 'app/entities/responsable/responsable.model';
import { ResponsableService } from 'app/entities/responsable/service/responsable.service';

import { EntretienUpdateComponent } from './entretien-update.component';

describe('Entretien Management Update Component', () => {
  let comp: EntretienUpdateComponent;
  let fixture: ComponentFixture<EntretienUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let entretienFormService: EntretienFormService;
  let entretienService: EntretienService;
  let responsableService: ResponsableService;

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
    responsableService = TestBed.inject(ResponsableService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Responsable query and add missing value', () => {
      const entretien: IEntretien = { id: 456 };
      const responsable: IResponsable = { id: 86972 };
      entretien.responsable = responsable;

      const responsableCollection: IResponsable[] = [{ id: 14622 }];
      jest.spyOn(responsableService, 'query').mockReturnValue(of(new HttpResponse({ body: responsableCollection })));
      const additionalResponsables = [responsable];
      const expectedCollection: IResponsable[] = [...additionalResponsables, ...responsableCollection];
      jest.spyOn(responsableService, 'addResponsableToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ entretien });
      comp.ngOnInit();

      expect(responsableService.query).toHaveBeenCalled();
      expect(responsableService.addResponsableToCollectionIfMissing).toHaveBeenCalledWith(
        responsableCollection,
        ...additionalResponsables.map(expect.objectContaining)
      );
      expect(comp.responsablesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const entretien: IEntretien = { id: 456 };
      const responsable: IResponsable = { id: 99263 };
      entretien.responsable = responsable;

      activatedRoute.data = of({ entretien });
      comp.ngOnInit();

      expect(comp.responsablesSharedCollection).toContain(responsable);
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
    describe('compareResponsable', () => {
      it('Should forward to responsableService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(responsableService, 'compareResponsable');
        comp.compareResponsable(entity, entity2);
        expect(responsableService.compareResponsable).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});

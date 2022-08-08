import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ResponsableFormService } from './responsable-form.service';
import { ResponsableService } from '../service/responsable.service';
import { IResponsable } from '../responsable.model';

import { ResponsableUpdateComponent } from './responsable-update.component';

describe('Responsable Management Update Component', () => {
  let comp: ResponsableUpdateComponent;
  let fixture: ComponentFixture<ResponsableUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let responsableFormService: ResponsableFormService;
  let responsableService: ResponsableService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ResponsableUpdateComponent],
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
      .overrideTemplate(ResponsableUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ResponsableUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    responsableFormService = TestBed.inject(ResponsableFormService);
    responsableService = TestBed.inject(ResponsableService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const responsable: IResponsable = { id: 456 };

      activatedRoute.data = of({ responsable });
      comp.ngOnInit();

      expect(comp.responsable).toEqual(responsable);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IResponsable>>();
      const responsable = { id: 123 };
      jest.spyOn(responsableFormService, 'getResponsable').mockReturnValue(responsable);
      jest.spyOn(responsableService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ responsable });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: responsable }));
      saveSubject.complete();

      // THEN
      expect(responsableFormService.getResponsable).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(responsableService.update).toHaveBeenCalledWith(expect.objectContaining(responsable));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IResponsable>>();
      const responsable = { id: 123 };
      jest.spyOn(responsableFormService, 'getResponsable').mockReturnValue({ id: null });
      jest.spyOn(responsableService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ responsable: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: responsable }));
      saveSubject.complete();

      // THEN
      expect(responsableFormService.getResponsable).toHaveBeenCalled();
      expect(responsableService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IResponsable>>();
      const responsable = { id: 123 };
      jest.spyOn(responsableService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ responsable });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(responsableService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});

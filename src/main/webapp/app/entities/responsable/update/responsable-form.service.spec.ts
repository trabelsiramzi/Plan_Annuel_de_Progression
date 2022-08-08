import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../responsable.test-samples';

import { ResponsableFormService } from './responsable-form.service';

describe('Responsable Form Service', () => {
  let service: ResponsableFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResponsableFormService);
  });

  describe('Service methods', () => {
    describe('createResponsableFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createResponsableFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nommanager: expect.any(Object),
            nomteamlead: expect.any(Object),
          })
        );
      });

      it('passing IResponsable should create a new form with FormGroup', () => {
        const formGroup = service.createResponsableFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nommanager: expect.any(Object),
            nomteamlead: expect.any(Object),
          })
        );
      });
    });

    describe('getResponsable', () => {
      it('should return NewResponsable for default Responsable initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createResponsableFormGroup(sampleWithNewData);

        const responsable = service.getResponsable(formGroup) as any;

        expect(responsable).toMatchObject(sampleWithNewData);
      });

      it('should return NewResponsable for empty Responsable initial value', () => {
        const formGroup = service.createResponsableFormGroup();

        const responsable = service.getResponsable(formGroup) as any;

        expect(responsable).toMatchObject({});
      });

      it('should return IResponsable', () => {
        const formGroup = service.createResponsableFormGroup(sampleWithRequiredData);

        const responsable = service.getResponsable(formGroup) as any;

        expect(responsable).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IResponsable should not enable id FormControl', () => {
        const formGroup = service.createResponsableFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewResponsable should disable id FormControl', () => {
        const formGroup = service.createResponsableFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});

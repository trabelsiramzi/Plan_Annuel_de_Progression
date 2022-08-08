import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../entretien.test-samples';

import { EntretienFormService } from './entretien-form.service';

describe('Entretien Form Service', () => {
  let service: EntretienFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntretienFormService);
  });

  describe('Service methods', () => {
    describe('createEntretienFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createEntretienFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            dateentretient: expect.any(Object),
            resultat: expect.any(Object),
            confirmationresponsable: expect.any(Object),
            confirmationsalarie: expect.any(Object),
            responsable: expect.any(Object),
          })
        );
      });

      it('passing IEntretien should create a new form with FormGroup', () => {
        const formGroup = service.createEntretienFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            dateentretient: expect.any(Object),
            resultat: expect.any(Object),
            confirmationresponsable: expect.any(Object),
            confirmationsalarie: expect.any(Object),
            responsable: expect.any(Object),
          })
        );
      });
    });

    describe('getEntretien', () => {
      it('should return NewEntretien for default Entretien initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createEntretienFormGroup(sampleWithNewData);

        const entretien = service.getEntretien(formGroup) as any;

        expect(entretien).toMatchObject(sampleWithNewData);
      });

      it('should return NewEntretien for empty Entretien initial value', () => {
        const formGroup = service.createEntretienFormGroup();

        const entretien = service.getEntretien(formGroup) as any;

        expect(entretien).toMatchObject({});
      });

      it('should return IEntretien', () => {
        const formGroup = service.createEntretienFormGroup(sampleWithRequiredData);

        const entretien = service.getEntretien(formGroup) as any;

        expect(entretien).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IEntretien should not enable id FormControl', () => {
        const formGroup = service.createEntretienFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewEntretien should disable id FormControl', () => {
        const formGroup = service.createEntretienFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});

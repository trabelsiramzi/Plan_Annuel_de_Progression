import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../competance.test-samples';

import { CompetanceFormService } from './competance-form.service';

describe('Competance Form Service', () => {
  let service: CompetanceFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompetanceFormService);
  });

  describe('Service methods', () => {
    describe('createCompetanceFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCompetanceFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nomCompetance: expect.any(Object),
            description: expect.any(Object),
            niveau: expect.any(Object),
            affectation: expect.any(Object),
          })
        );
      });

      it('passing ICompetance should create a new form with FormGroup', () => {
        const formGroup = service.createCompetanceFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nomCompetance: expect.any(Object),
            description: expect.any(Object),
            niveau: expect.any(Object),
            affectation: expect.any(Object),
          })
        );
      });
    });

    describe('getCompetance', () => {
      it('should return NewCompetance for default Competance initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createCompetanceFormGroup(sampleWithNewData);

        const competance = service.getCompetance(formGroup) as any;

        expect(competance).toMatchObject(sampleWithNewData);
      });

      it('should return NewCompetance for empty Competance initial value', () => {
        const formGroup = service.createCompetanceFormGroup();

        const competance = service.getCompetance(formGroup) as any;

        expect(competance).toMatchObject({});
      });

      it('should return ICompetance', () => {
        const formGroup = service.createCompetanceFormGroup(sampleWithRequiredData);

        const competance = service.getCompetance(formGroup) as any;

        expect(competance).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICompetance should not enable id FormControl', () => {
        const formGroup = service.createCompetanceFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCompetance should disable id FormControl', () => {
        const formGroup = service.createCompetanceFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});

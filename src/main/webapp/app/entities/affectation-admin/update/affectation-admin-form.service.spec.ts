import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../affectation-admin.test-samples';

import { AffectationAdminFormService } from './affectation-admin-form.service';

describe('AffectationAdmin Form Service', () => {
  let service: AffectationAdminFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AffectationAdminFormService);
  });

  describe('Service methods', () => {
    describe('createAffectationAdminFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createAffectationAdminFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            datedebut: expect.any(Object),
            datefin: expect.any(Object),
          })
        );
      });

      it('passing IAffectationAdmin should create a new form with FormGroup', () => {
        const formGroup = service.createAffectationAdminFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            datedebut: expect.any(Object),
            datefin: expect.any(Object),
          })
        );
      });
    });

    describe('getAffectationAdmin', () => {
      it('should return NewAffectationAdmin for default AffectationAdmin initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createAffectationAdminFormGroup(sampleWithNewData);

        const affectationAdmin = service.getAffectationAdmin(formGroup) as any;

        expect(affectationAdmin).toMatchObject(sampleWithNewData);
      });

      it('should return NewAffectationAdmin for empty AffectationAdmin initial value', () => {
        const formGroup = service.createAffectationAdminFormGroup();

        const affectationAdmin = service.getAffectationAdmin(formGroup) as any;

        expect(affectationAdmin).toMatchObject({});
      });

      it('should return IAffectationAdmin', () => {
        const formGroup = service.createAffectationAdminFormGroup(sampleWithRequiredData);

        const affectationAdmin = service.getAffectationAdmin(formGroup) as any;

        expect(affectationAdmin).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IAffectationAdmin should not enable id FormControl', () => {
        const formGroup = service.createAffectationAdminFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewAffectationAdmin should disable id FormControl', () => {
        const formGroup = service.createAffectationAdminFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});

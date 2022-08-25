import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAffectationAdmin } from '../affectation-admin.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../affectation-admin.test-samples';

import { AffectationAdminService, RestAffectationAdmin } from './affectation-admin.service';

const requireRestSample: RestAffectationAdmin = {
  ...sampleWithRequiredData,
  datedebut: sampleWithRequiredData.datedebut?.toJSON(),
  datefin: sampleWithRequiredData.datefin?.toJSON(),
};

describe('AffectationAdmin Service', () => {
  let service: AffectationAdminService;
  let httpMock: HttpTestingController;
  let expectedResult: IAffectationAdmin | IAffectationAdmin[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(AffectationAdminService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a AffectationAdmin', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const affectationAdmin = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(affectationAdmin).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a AffectationAdmin', () => {
      const affectationAdmin = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(affectationAdmin).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a AffectationAdmin', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of AffectationAdmin', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a AffectationAdmin', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addAffectationAdminToCollectionIfMissing', () => {
      it('should add a AffectationAdmin to an empty array', () => {
        const affectationAdmin: IAffectationAdmin = sampleWithRequiredData;
        expectedResult = service.addAffectationAdminToCollectionIfMissing([], affectationAdmin);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(affectationAdmin);
      });

      it('should not add a AffectationAdmin to an array that contains it', () => {
        const affectationAdmin: IAffectationAdmin = sampleWithRequiredData;
        const affectationAdminCollection: IAffectationAdmin[] = [
          {
            ...affectationAdmin,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addAffectationAdminToCollectionIfMissing(affectationAdminCollection, affectationAdmin);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a AffectationAdmin to an array that doesn't contain it", () => {
        const affectationAdmin: IAffectationAdmin = sampleWithRequiredData;
        const affectationAdminCollection: IAffectationAdmin[] = [sampleWithPartialData];
        expectedResult = service.addAffectationAdminToCollectionIfMissing(affectationAdminCollection, affectationAdmin);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(affectationAdmin);
      });

      it('should add only unique AffectationAdmin to an array', () => {
        const affectationAdminArray: IAffectationAdmin[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const affectationAdminCollection: IAffectationAdmin[] = [sampleWithRequiredData];
        expectedResult = service.addAffectationAdminToCollectionIfMissing(affectationAdminCollection, ...affectationAdminArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const affectationAdmin: IAffectationAdmin = sampleWithRequiredData;
        const affectationAdmin2: IAffectationAdmin = sampleWithPartialData;
        expectedResult = service.addAffectationAdminToCollectionIfMissing([], affectationAdmin, affectationAdmin2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(affectationAdmin);
        expect(expectedResult).toContain(affectationAdmin2);
      });

      it('should accept null and undefined values', () => {
        const affectationAdmin: IAffectationAdmin = sampleWithRequiredData;
        expectedResult = service.addAffectationAdminToCollectionIfMissing([], null, affectationAdmin, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(affectationAdmin);
      });

      it('should return initial array if no AffectationAdmin is added', () => {
        const affectationAdminCollection: IAffectationAdmin[] = [sampleWithRequiredData];
        expectedResult = service.addAffectationAdminToCollectionIfMissing(affectationAdminCollection, undefined, null);
        expect(expectedResult).toEqual(affectationAdminCollection);
      });
    });

    describe('compareAffectationAdmin', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareAffectationAdmin(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareAffectationAdmin(entity1, entity2);
        const compareResult2 = service.compareAffectationAdmin(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareAffectationAdmin(entity1, entity2);
        const compareResult2 = service.compareAffectationAdmin(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareAffectationAdmin(entity1, entity2);
        const compareResult2 = service.compareAffectationAdmin(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IEtablissement } from '../etablissement.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../etablissement.test-samples';

import { EtablissementService } from './etablissement.service';

const requireRestSample: IEtablissement = {
  ...sampleWithRequiredData,
};

describe('Etablissement Service', () => {
  let service: EtablissementService;
  let httpMock: HttpTestingController;
  let expectedResult: IEtablissement | IEtablissement[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(EtablissementService);
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

    it('should create a Etablissement', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const etablissement = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(etablissement).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Etablissement', () => {
      const etablissement = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(etablissement).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Etablissement', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Etablissement', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Etablissement', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addEtablissementToCollectionIfMissing', () => {
      it('should add a Etablissement to an empty array', () => {
        const etablissement: IEtablissement = sampleWithRequiredData;
        expectedResult = service.addEtablissementToCollectionIfMissing([], etablissement);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(etablissement);
      });

      it('should not add a Etablissement to an array that contains it', () => {
        const etablissement: IEtablissement = sampleWithRequiredData;
        const etablissementCollection: IEtablissement[] = [
          {
            ...etablissement,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addEtablissementToCollectionIfMissing(etablissementCollection, etablissement);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Etablissement to an array that doesn't contain it", () => {
        const etablissement: IEtablissement = sampleWithRequiredData;
        const etablissementCollection: IEtablissement[] = [sampleWithPartialData];
        expectedResult = service.addEtablissementToCollectionIfMissing(etablissementCollection, etablissement);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(etablissement);
      });

      it('should add only unique Etablissement to an array', () => {
        const etablissementArray: IEtablissement[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const etablissementCollection: IEtablissement[] = [sampleWithRequiredData];
        expectedResult = service.addEtablissementToCollectionIfMissing(etablissementCollection, ...etablissementArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const etablissement: IEtablissement = sampleWithRequiredData;
        const etablissement2: IEtablissement = sampleWithPartialData;
        expectedResult = service.addEtablissementToCollectionIfMissing([], etablissement, etablissement2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(etablissement);
        expect(expectedResult).toContain(etablissement2);
      });

      it('should accept null and undefined values', () => {
        const etablissement: IEtablissement = sampleWithRequiredData;
        expectedResult = service.addEtablissementToCollectionIfMissing([], null, etablissement, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(etablissement);
      });

      it('should return initial array if no Etablissement is added', () => {
        const etablissementCollection: IEtablissement[] = [sampleWithRequiredData];
        expectedResult = service.addEtablissementToCollectionIfMissing(etablissementCollection, undefined, null);
        expect(expectedResult).toEqual(etablissementCollection);
      });
    });

    describe('compareEtablissement', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareEtablissement(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareEtablissement(entity1, entity2);
        const compareResult2 = service.compareEtablissement(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareEtablissement(entity1, entity2);
        const compareResult2 = service.compareEtablissement(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareEtablissement(entity1, entity2);
        const compareResult2 = service.compareEtablissement(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});

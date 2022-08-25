import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICompetance } from '../competance.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../competance.test-samples';

import { CompetanceService } from './competance.service';

const requireRestSample: ICompetance = {
  ...sampleWithRequiredData,
};

describe('Competance Service', () => {
  let service: CompetanceService;
  let httpMock: HttpTestingController;
  let expectedResult: ICompetance | ICompetance[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CompetanceService);
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

    it('should create a Competance', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const competance = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(competance).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Competance', () => {
      const competance = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(competance).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Competance', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Competance', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Competance', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addCompetanceToCollectionIfMissing', () => {
      it('should add a Competance to an empty array', () => {
        const competance: ICompetance = sampleWithRequiredData;
        expectedResult = service.addCompetanceToCollectionIfMissing([], competance);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(competance);
      });

      it('should not add a Competance to an array that contains it', () => {
        const competance: ICompetance = sampleWithRequiredData;
        const competanceCollection: ICompetance[] = [
          {
            ...competance,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCompetanceToCollectionIfMissing(competanceCollection, competance);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Competance to an array that doesn't contain it", () => {
        const competance: ICompetance = sampleWithRequiredData;
        const competanceCollection: ICompetance[] = [sampleWithPartialData];
        expectedResult = service.addCompetanceToCollectionIfMissing(competanceCollection, competance);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(competance);
      });

      it('should add only unique Competance to an array', () => {
        const competanceArray: ICompetance[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const competanceCollection: ICompetance[] = [sampleWithRequiredData];
        expectedResult = service.addCompetanceToCollectionIfMissing(competanceCollection, ...competanceArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const competance: ICompetance = sampleWithRequiredData;
        const competance2: ICompetance = sampleWithPartialData;
        expectedResult = service.addCompetanceToCollectionIfMissing([], competance, competance2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(competance);
        expect(expectedResult).toContain(competance2);
      });

      it('should accept null and undefined values', () => {
        const competance: ICompetance = sampleWithRequiredData;
        expectedResult = service.addCompetanceToCollectionIfMissing([], null, competance, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(competance);
      });

      it('should return initial array if no Competance is added', () => {
        const competanceCollection: ICompetance[] = [sampleWithRequiredData];
        expectedResult = service.addCompetanceToCollectionIfMissing(competanceCollection, undefined, null);
        expect(expectedResult).toEqual(competanceCollection);
      });
    });

    describe('compareCompetance', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCompetance(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareCompetance(entity1, entity2);
        const compareResult2 = service.compareCompetance(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareCompetance(entity1, entity2);
        const compareResult2 = service.compareCompetance(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareCompetance(entity1, entity2);
        const compareResult2 = service.compareCompetance(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IEntretien } from '../entretien.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../entretien.test-samples';

import { EntretienService, RestEntretien } from './entretien.service';

const requireRestSample: RestEntretien = {
  ...sampleWithRequiredData,
  dateentretient: sampleWithRequiredData.dateentretient?.toJSON(),
};

describe('Entretien Service', () => {
  let service: EntretienService;
  let httpMock: HttpTestingController;
  let expectedResult: IEntretien | IEntretien[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(EntretienService);
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

    it('should create a Entretien', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const entretien = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(entretien).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Entretien', () => {
      const entretien = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(entretien).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Entretien', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Entretien', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Entretien', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addEntretienToCollectionIfMissing', () => {
      it('should add a Entretien to an empty array', () => {
        const entretien: IEntretien = sampleWithRequiredData;
        expectedResult = service.addEntretienToCollectionIfMissing([], entretien);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(entretien);
      });

      it('should not add a Entretien to an array that contains it', () => {
        const entretien: IEntretien = sampleWithRequiredData;
        const entretienCollection: IEntretien[] = [
          {
            ...entretien,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addEntretienToCollectionIfMissing(entretienCollection, entretien);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Entretien to an array that doesn't contain it", () => {
        const entretien: IEntretien = sampleWithRequiredData;
        const entretienCollection: IEntretien[] = [sampleWithPartialData];
        expectedResult = service.addEntretienToCollectionIfMissing(entretienCollection, entretien);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(entretien);
      });

      it('should add only unique Entretien to an array', () => {
        const entretienArray: IEntretien[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const entretienCollection: IEntretien[] = [sampleWithRequiredData];
        expectedResult = service.addEntretienToCollectionIfMissing(entretienCollection, ...entretienArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const entretien: IEntretien = sampleWithRequiredData;
        const entretien2: IEntretien = sampleWithPartialData;
        expectedResult = service.addEntretienToCollectionIfMissing([], entretien, entretien2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(entretien);
        expect(expectedResult).toContain(entretien2);
      });

      it('should accept null and undefined values', () => {
        const entretien: IEntretien = sampleWithRequiredData;
        expectedResult = service.addEntretienToCollectionIfMissing([], null, entretien, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(entretien);
      });

      it('should return initial array if no Entretien is added', () => {
        const entretienCollection: IEntretien[] = [sampleWithRequiredData];
        expectedResult = service.addEntretienToCollectionIfMissing(entretienCollection, undefined, null);
        expect(expectedResult).toEqual(entretienCollection);
      });
    });

    describe('compareEntretien', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareEntretien(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareEntretien(entity1, entity2);
        const compareResult2 = service.compareEntretien(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareEntretien(entity1, entity2);
        const compareResult2 = service.compareEntretien(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareEntretien(entity1, entity2);
        const compareResult2 = service.compareEntretien(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});

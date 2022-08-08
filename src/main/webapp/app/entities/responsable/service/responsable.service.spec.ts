import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IResponsable } from '../responsable.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../responsable.test-samples';

import { ResponsableService } from './responsable.service';

const requireRestSample: IResponsable = {
  ...sampleWithRequiredData,
};

describe('Responsable Service', () => {
  let service: ResponsableService;
  let httpMock: HttpTestingController;
  let expectedResult: IResponsable | IResponsable[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ResponsableService);
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

    it('should create a Responsable', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const responsable = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(responsable).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Responsable', () => {
      const responsable = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(responsable).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Responsable', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Responsable', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Responsable', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addResponsableToCollectionIfMissing', () => {
      it('should add a Responsable to an empty array', () => {
        const responsable: IResponsable = sampleWithRequiredData;
        expectedResult = service.addResponsableToCollectionIfMissing([], responsable);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(responsable);
      });

      it('should not add a Responsable to an array that contains it', () => {
        const responsable: IResponsable = sampleWithRequiredData;
        const responsableCollection: IResponsable[] = [
          {
            ...responsable,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addResponsableToCollectionIfMissing(responsableCollection, responsable);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Responsable to an array that doesn't contain it", () => {
        const responsable: IResponsable = sampleWithRequiredData;
        const responsableCollection: IResponsable[] = [sampleWithPartialData];
        expectedResult = service.addResponsableToCollectionIfMissing(responsableCollection, responsable);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(responsable);
      });

      it('should add only unique Responsable to an array', () => {
        const responsableArray: IResponsable[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const responsableCollection: IResponsable[] = [sampleWithRequiredData];
        expectedResult = service.addResponsableToCollectionIfMissing(responsableCollection, ...responsableArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const responsable: IResponsable = sampleWithRequiredData;
        const responsable2: IResponsable = sampleWithPartialData;
        expectedResult = service.addResponsableToCollectionIfMissing([], responsable, responsable2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(responsable);
        expect(expectedResult).toContain(responsable2);
      });

      it('should accept null and undefined values', () => {
        const responsable: IResponsable = sampleWithRequiredData;
        expectedResult = service.addResponsableToCollectionIfMissing([], null, responsable, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(responsable);
      });

      it('should return initial array if no Responsable is added', () => {
        const responsableCollection: IResponsable[] = [sampleWithRequiredData];
        expectedResult = service.addResponsableToCollectionIfMissing(responsableCollection, undefined, null);
        expect(expectedResult).toEqual(responsableCollection);
      });
    });

    describe('compareResponsable', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareResponsable(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareResponsable(entity1, entity2);
        const compareResult2 = service.compareResponsable(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareResponsable(entity1, entity2);
        const compareResult2 = service.compareResponsable(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareResponsable(entity1, entity2);
        const compareResult2 = service.compareResponsable(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});

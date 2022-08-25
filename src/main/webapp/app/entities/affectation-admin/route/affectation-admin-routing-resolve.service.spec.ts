import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IAffectationAdmin } from '../affectation-admin.model';
import { AffectationAdminService } from '../service/affectation-admin.service';

import { AffectationAdminRoutingResolveService } from './affectation-admin-routing-resolve.service';

describe('AffectationAdmin routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: AffectationAdminRoutingResolveService;
  let service: AffectationAdminService;
  let resultAffectationAdmin: IAffectationAdmin | null | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(AffectationAdminRoutingResolveService);
    service = TestBed.inject(AffectationAdminService);
    resultAffectationAdmin = undefined;
  });

  describe('resolve', () => {
    it('should return IAffectationAdmin returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultAffectationAdmin = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultAffectationAdmin).toEqual({ id: 123 });
    });

    it('should return null if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultAffectationAdmin = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultAffectationAdmin).toEqual(null);
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse<IAffectationAdmin>({ body: null })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultAffectationAdmin = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultAffectationAdmin).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});

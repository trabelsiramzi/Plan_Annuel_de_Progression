import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAffectationAdmin } from '../affectation-admin.model';
import { AffectationAdminService } from '../service/affectation-admin.service';

@Injectable({ providedIn: 'root' })
export class AffectationAdminRoutingResolveService implements Resolve<IAffectationAdmin | null> {
  constructor(protected service: AffectationAdminService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAffectationAdmin | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((affectationAdmin: HttpResponse<IAffectationAdmin>) => {
          if (affectationAdmin.body) {
            return of(affectationAdmin.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}

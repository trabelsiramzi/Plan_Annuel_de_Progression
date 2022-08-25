import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAffectation } from '../affectation.model';
import { AffectationService } from '../service/affectation.service';

@Injectable({ providedIn: 'root' })
export class AffectationRoutingResolveService implements Resolve<IAffectation | null> {
  constructor(protected service: AffectationService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAffectation | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((affectation: HttpResponse<IAffectation>) => {
          if (affectation.body) {
            return of(affectation.body);
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

import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAffectationAdmin, NewAffectationAdmin } from '../affectation-admin.model';

export type PartialUpdateAffectationAdmin = Partial<IAffectationAdmin> & Pick<IAffectationAdmin, 'id'>;

type RestOf<T extends IAffectationAdmin | NewAffectationAdmin> = Omit<T, 'datedebut' | 'datefin'> & {
  datedebut?: string | null;
  datefin?: string | null;
};

export type RestAffectationAdmin = RestOf<IAffectationAdmin>;

export type NewRestAffectationAdmin = RestOf<NewAffectationAdmin>;

export type PartialUpdateRestAffectationAdmin = RestOf<PartialUpdateAffectationAdmin>;

export type EntityResponseType = HttpResponse<IAffectationAdmin>;
export type EntityArrayResponseType = HttpResponse<IAffectationAdmin[]>;

@Injectable({ providedIn: 'root' })
export class AffectationAdminService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/affectation-admins');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(affectationAdmin: NewAffectationAdmin): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(affectationAdmin);
    return this.http
      .post<RestAffectationAdmin>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(affectationAdmin: IAffectationAdmin): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(affectationAdmin);
    return this.http
      .put<RestAffectationAdmin>(`${this.resourceUrl}/${this.getAffectationAdminIdentifier(affectationAdmin)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(affectationAdmin: PartialUpdateAffectationAdmin): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(affectationAdmin);
    return this.http
      .patch<RestAffectationAdmin>(`${this.resourceUrl}/${this.getAffectationAdminIdentifier(affectationAdmin)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestAffectationAdmin>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestAffectationAdmin[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAffectationAdminIdentifier(affectationAdmin: Pick<IAffectationAdmin, 'id'>): number {
    return affectationAdmin.id;
  }

  compareAffectationAdmin(o1: Pick<IAffectationAdmin, 'id'> | null, o2: Pick<IAffectationAdmin, 'id'> | null): boolean {
    return o1 && o2 ? this.getAffectationAdminIdentifier(o1) === this.getAffectationAdminIdentifier(o2) : o1 === o2;
  }

  addAffectationAdminToCollectionIfMissing<Type extends Pick<IAffectationAdmin, 'id'>>(
    affectationAdminCollection: Type[],
    ...affectationAdminsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const affectationAdmins: Type[] = affectationAdminsToCheck.filter(isPresent);
    if (affectationAdmins.length > 0) {
      const affectationAdminCollectionIdentifiers = affectationAdminCollection.map(
        affectationAdminItem => this.getAffectationAdminIdentifier(affectationAdminItem)!
      );
      const affectationAdminsToAdd = affectationAdmins.filter(affectationAdminItem => {
        const affectationAdminIdentifier = this.getAffectationAdminIdentifier(affectationAdminItem);
        if (affectationAdminCollectionIdentifiers.includes(affectationAdminIdentifier)) {
          return false;
        }
        affectationAdminCollectionIdentifiers.push(affectationAdminIdentifier);
        return true;
      });
      return [...affectationAdminsToAdd, ...affectationAdminCollection];
    }
    return affectationAdminCollection;
  }

  protected convertDateFromClient<T extends IAffectationAdmin | NewAffectationAdmin | PartialUpdateAffectationAdmin>(
    affectationAdmin: T
  ): RestOf<T> {
    return {
      ...affectationAdmin,
      datedebut: affectationAdmin.datedebut?.toJSON() ?? null,
      datefin: affectationAdmin.datefin?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restAffectationAdmin: RestAffectationAdmin): IAffectationAdmin {
    return {
      ...restAffectationAdmin,
      datedebut: restAffectationAdmin.datedebut ? dayjs(restAffectationAdmin.datedebut) : undefined,
      datefin: restAffectationAdmin.datefin ? dayjs(restAffectationAdmin.datefin) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestAffectationAdmin>): HttpResponse<IAffectationAdmin> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestAffectationAdmin[]>): HttpResponse<IAffectationAdmin[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}

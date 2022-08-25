import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAffectation, NewAffectation } from '../affectation.model';

export type PartialUpdateAffectation = Partial<IAffectation> & Pick<IAffectation, 'id'>;

type RestOf<T extends IAffectation | NewAffectation> = Omit<T, 'datedebut' | 'datefin'> & {
  datedebut?: string | null;
  datefin?: string | null;
};

export type RestAffectation = RestOf<IAffectation>;

export type NewRestAffectation = RestOf<NewAffectation>;

export type PartialUpdateRestAffectation = RestOf<PartialUpdateAffectation>;

export type EntityResponseType = HttpResponse<IAffectation>;
export type EntityArrayResponseType = HttpResponse<IAffectation[]>;

@Injectable({ providedIn: 'root' })
export class AffectationService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/affectations');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(affectation: NewAffectation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(affectation);
    return this.http
      .post<RestAffectation>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(affectation: IAffectation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(affectation);
    return this.http
      .put<RestAffectation>(`${this.resourceUrl}/${this.getAffectationIdentifier(affectation)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(affectation: PartialUpdateAffectation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(affectation);
    return this.http
      .patch<RestAffectation>(`${this.resourceUrl}/${this.getAffectationIdentifier(affectation)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestAffectation>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestAffectation[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAffectationIdentifier(affectation: Pick<IAffectation, 'id'>): number {
    return affectation.id;
  }

  compareAffectation(o1: Pick<IAffectation, 'id'> | null, o2: Pick<IAffectation, 'id'> | null): boolean {
    return o1 && o2 ? this.getAffectationIdentifier(o1) === this.getAffectationIdentifier(o2) : o1 === o2;
  }

  addAffectationToCollectionIfMissing<Type extends Pick<IAffectation, 'id'>>(
    affectationCollection: Type[],
    ...affectationsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const affectations: Type[] = affectationsToCheck.filter(isPresent);
    if (affectations.length > 0) {
      const affectationCollectionIdentifiers = affectationCollection.map(
        affectationItem => this.getAffectationIdentifier(affectationItem)!
      );
      const affectationsToAdd = affectations.filter(affectationItem => {
        const affectationIdentifier = this.getAffectationIdentifier(affectationItem);
        if (affectationCollectionIdentifiers.includes(affectationIdentifier)) {
          return false;
        }
        affectationCollectionIdentifiers.push(affectationIdentifier);
        return true;
      });
      return [...affectationsToAdd, ...affectationCollection];
    }
    return affectationCollection;
  }

  protected convertDateFromClient<T extends IAffectation | NewAffectation | PartialUpdateAffectation>(affectation: T): RestOf<T> {
    return {
      ...affectation,
      datedebut: affectation.datedebut?.toJSON() ?? null,
      datefin: affectation.datefin?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restAffectation: RestAffectation): IAffectation {
    return {
      ...restAffectation,
      datedebut: restAffectation.datedebut ? dayjs(restAffectation.datedebut) : undefined,
      datefin: restAffectation.datefin ? dayjs(restAffectation.datefin) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestAffectation>): HttpResponse<IAffectation> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestAffectation[]>): HttpResponse<IAffectation[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}

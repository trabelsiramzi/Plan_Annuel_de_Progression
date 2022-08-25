import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEntretien, NewEntretien } from '../entretien.model';

export type PartialUpdateEntretien = Partial<IEntretien> & Pick<IEntretien, 'id'>;

type RestOf<T extends IEntretien | NewEntretien> = Omit<T, 'dateentretient'> & {
  dateentretient?: string | null;
};

export type RestEntretien = RestOf<IEntretien>;

export type NewRestEntretien = RestOf<NewEntretien>;

export type PartialUpdateRestEntretien = RestOf<PartialUpdateEntretien>;

export type EntityResponseType = HttpResponse<IEntretien>;
export type EntityArrayResponseType = HttpResponse<IEntretien[]>;

@Injectable({ providedIn: 'root' })
export class EntretienService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/entretiens');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(entretien: NewEntretien): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(entretien);
    return this.http
      .post<RestEntretien>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(entretien: IEntretien): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(entretien);
    return this.http
      .put<RestEntretien>(`${this.resourceUrl}/${this.getEntretienIdentifier(entretien)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(entretien: PartialUpdateEntretien): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(entretien);
    return this.http
      .patch<RestEntretien>(`${this.resourceUrl}/${this.getEntretienIdentifier(entretien)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestEntretien>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestEntretien[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getEntretienIdentifier(entretien: Pick<IEntretien, 'id'>): number {
    return entretien.id;
  }

  compareEntretien(o1: Pick<IEntretien, 'id'> | null, o2: Pick<IEntretien, 'id'> | null): boolean {
    return o1 && o2 ? this.getEntretienIdentifier(o1) === this.getEntretienIdentifier(o2) : o1 === o2;
  }

  addEntretienToCollectionIfMissing<Type extends Pick<IEntretien, 'id'>>(
    entretienCollection: Type[],
    ...entretiensToCheck: (Type | null | undefined)[]
  ): Type[] {
    const entretiens: Type[] = entretiensToCheck.filter(isPresent);
    if (entretiens.length > 0) {
      const entretienCollectionIdentifiers = entretienCollection.map(entretienItem => this.getEntretienIdentifier(entretienItem)!);
      const entretiensToAdd = entretiens.filter(entretienItem => {
        const entretienIdentifier = this.getEntretienIdentifier(entretienItem);
        if (entretienCollectionIdentifiers.includes(entretienIdentifier)) {
          return false;
        }
        entretienCollectionIdentifiers.push(entretienIdentifier);
        return true;
      });
      return [...entretiensToAdd, ...entretienCollection];
    }
    return entretienCollection;
  }

  protected convertDateFromClient<T extends IEntretien | NewEntretien | PartialUpdateEntretien>(entretien: T): RestOf<T> {
    return {
      ...entretien,
      dateentretient: entretien.dateentretient?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restEntretien: RestEntretien): IEntretien {
    return {
      ...restEntretien,
      dateentretient: restEntretien.dateentretient ? dayjs(restEntretien.dateentretient) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestEntretien>): HttpResponse<IEntretien> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestEntretien[]>): HttpResponse<IEntretien[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}

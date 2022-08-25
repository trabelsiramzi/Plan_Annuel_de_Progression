import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICompetance, NewCompetance } from '../competance.model';

export type PartialUpdateCompetance = Partial<ICompetance> & Pick<ICompetance, 'id'>;

export type EntityResponseType = HttpResponse<ICompetance>;
export type EntityArrayResponseType = HttpResponse<ICompetance[]>;

@Injectable({ providedIn: 'root' })
export class CompetanceService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/competances');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(competance: NewCompetance): Observable<EntityResponseType> {
    return this.http.post<ICompetance>(this.resourceUrl, competance, { observe: 'response' });
  }

  update(competance: ICompetance): Observable<EntityResponseType> {
    return this.http.put<ICompetance>(`${this.resourceUrl}/${this.getCompetanceIdentifier(competance)}`, competance, {
      observe: 'response',
    });
  }

  partialUpdate(competance: PartialUpdateCompetance): Observable<EntityResponseType> {
    return this.http.patch<ICompetance>(`${this.resourceUrl}/${this.getCompetanceIdentifier(competance)}`, competance, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICompetance>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICompetance[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCompetanceIdentifier(competance: Pick<ICompetance, 'id'>): number {
    return competance.id;
  }

  compareCompetance(o1: Pick<ICompetance, 'id'> | null, o2: Pick<ICompetance, 'id'> | null): boolean {
    return o1 && o2 ? this.getCompetanceIdentifier(o1) === this.getCompetanceIdentifier(o2) : o1 === o2;
  }

  addCompetanceToCollectionIfMissing<Type extends Pick<ICompetance, 'id'>>(
    competanceCollection: Type[],
    ...competancesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const competances: Type[] = competancesToCheck.filter(isPresent);
    if (competances.length > 0) {
      const competanceCollectionIdentifiers = competanceCollection.map(competanceItem => this.getCompetanceIdentifier(competanceItem)!);
      const competancesToAdd = competances.filter(competanceItem => {
        const competanceIdentifier = this.getCompetanceIdentifier(competanceItem);
        if (competanceCollectionIdentifiers.includes(competanceIdentifier)) {
          return false;
        }
        competanceCollectionIdentifiers.push(competanceIdentifier);
        return true;
      });
      return [...competancesToAdd, ...competanceCollection];
    }
    return competanceCollection;
  }
}

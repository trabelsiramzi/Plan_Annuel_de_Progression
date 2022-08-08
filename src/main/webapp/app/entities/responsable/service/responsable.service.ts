import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IResponsable, NewResponsable } from '../responsable.model';

export type PartialUpdateResponsable = Partial<IResponsable> & Pick<IResponsable, 'id'>;

export type EntityResponseType = HttpResponse<IResponsable>;
export type EntityArrayResponseType = HttpResponse<IResponsable[]>;

@Injectable({ providedIn: 'root' })
export class ResponsableService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/responsables');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(responsable: NewResponsable): Observable<EntityResponseType> {
    return this.http.post<IResponsable>(this.resourceUrl, responsable, { observe: 'response' });
  }

  update(responsable: IResponsable): Observable<EntityResponseType> {
    return this.http.put<IResponsable>(`${this.resourceUrl}/${this.getResponsableIdentifier(responsable)}`, responsable, {
      observe: 'response',
    });
  }

  partialUpdate(responsable: PartialUpdateResponsable): Observable<EntityResponseType> {
    return this.http.patch<IResponsable>(`${this.resourceUrl}/${this.getResponsableIdentifier(responsable)}`, responsable, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IResponsable>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IResponsable[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getResponsableIdentifier(responsable: Pick<IResponsable, 'id'>): number {
    return responsable.id;
  }

  compareResponsable(o1: Pick<IResponsable, 'id'> | null, o2: Pick<IResponsable, 'id'> | null): boolean {
    return o1 && o2 ? this.getResponsableIdentifier(o1) === this.getResponsableIdentifier(o2) : o1 === o2;
  }

  addResponsableToCollectionIfMissing<Type extends Pick<IResponsable, 'id'>>(
    responsableCollection: Type[],
    ...responsablesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const responsables: Type[] = responsablesToCheck.filter(isPresent);
    if (responsables.length > 0) {
      const responsableCollectionIdentifiers = responsableCollection.map(
        responsableItem => this.getResponsableIdentifier(responsableItem)!
      );
      const responsablesToAdd = responsables.filter(responsableItem => {
        const responsableIdentifier = this.getResponsableIdentifier(responsableItem);
        if (responsableCollectionIdentifiers.includes(responsableIdentifier)) {
          return false;
        }
        responsableCollectionIdentifiers.push(responsableIdentifier);
        return true;
      });
      return [...responsablesToAdd, ...responsableCollection];
    }
    return responsableCollection;
  }
}

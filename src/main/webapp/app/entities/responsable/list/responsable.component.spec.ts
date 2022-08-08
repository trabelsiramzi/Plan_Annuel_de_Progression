import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ResponsableService } from '../service/responsable.service';

import { ResponsableComponent } from './responsable.component';

describe('Responsable Management Component', () => {
  let comp: ResponsableComponent;
  let fixture: ComponentFixture<ResponsableComponent>;
  let service: ResponsableService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'responsable', component: ResponsableComponent }]), HttpClientTestingModule],
      declarations: [ResponsableComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(ResponsableComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ResponsableComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ResponsableService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.responsables?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to responsableService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getResponsableIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getResponsableIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { AffectationAdminService } from '../service/affectation-admin.service';

import { AffectationAdminComponent } from './affectation-admin.component';

describe('AffectationAdmin Management Component', () => {
  let comp: AffectationAdminComponent;
  let fixture: ComponentFixture<AffectationAdminComponent>;
  let service: AffectationAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'affectation-admin', component: AffectationAdminComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [AffectationAdminComponent],
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
      .overrideTemplate(AffectationAdminComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AffectationAdminComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(AffectationAdminService);

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
    expect(comp.affectationAdmins?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to affectationAdminService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getAffectationAdminIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getAffectationAdminIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});

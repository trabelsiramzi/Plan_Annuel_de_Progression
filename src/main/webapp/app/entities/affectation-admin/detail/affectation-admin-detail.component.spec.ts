import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AffectationAdminDetailComponent } from './affectation-admin-detail.component';

describe('AffectationAdmin Management Detail Component', () => {
  let comp: AffectationAdminDetailComponent;
  let fixture: ComponentFixture<AffectationAdminDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AffectationAdminDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ affectationAdmin: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(AffectationAdminDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(AffectationAdminDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load affectationAdmin on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.affectationAdmin).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});

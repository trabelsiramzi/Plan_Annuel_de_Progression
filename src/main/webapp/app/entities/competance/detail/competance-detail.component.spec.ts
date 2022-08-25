import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CompetanceDetailComponent } from './competance-detail.component';

describe('Competance Management Detail Component', () => {
  let comp: CompetanceDetailComponent;
  let fixture: ComponentFixture<CompetanceDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompetanceDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ competance: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(CompetanceDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CompetanceDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load competance on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.competance).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});

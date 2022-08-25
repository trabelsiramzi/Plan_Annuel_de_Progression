import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EntretienDetailComponent } from './entretien-detail.component';

describe('Entretien Management Detail Component', () => {
  let comp: EntretienDetailComponent;
  let fixture: ComponentFixture<EntretienDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EntretienDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ entretien: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(EntretienDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(EntretienDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load entretien on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.entretien).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});

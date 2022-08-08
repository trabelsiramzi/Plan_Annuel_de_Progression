import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEntretien } from '../entretien.model';

@Component({
  selector: 'jhi-entretien-detail',
  templateUrl: './entretien-detail.component.html',
})
export class EntretienDetailComponent implements OnInit {
  entretien: IEntretien | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ entretien }) => {
      this.entretien = entretien;
    });
  }

  previousState(): void {
    window.history.back();
  }
}

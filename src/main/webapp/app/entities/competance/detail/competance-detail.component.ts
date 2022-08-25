import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICompetance } from '../competance.model';

@Component({
  selector: 'jhi-competance-detail',
  templateUrl: './competance-detail.component.html',
})
export class CompetanceDetailComponent implements OnInit {
  competance: ICompetance | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ competance }) => {
      this.competance = competance;
    });
  }

  previousState(): void {
    window.history.back();
  }
}

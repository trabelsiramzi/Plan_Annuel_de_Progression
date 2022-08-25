import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAffectationAdmin } from '../affectation-admin.model';

@Component({
  selector: 'jhi-affectation-admin-detail',
  templateUrl: './affectation-admin-detail.component.html',
})
export class AffectationAdminDetailComponent implements OnInit {
  affectationAdmin: IAffectationAdmin | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ affectationAdmin }) => {
      this.affectationAdmin = affectationAdmin;
    });
  }

  previousState(): void {
    window.history.back();
  }
}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CompetanceComponent } from '../list/competance.component';
import { CompetanceDetailComponent } from '../detail/competance-detail.component';
import { CompetanceUpdateComponent } from '../update/competance-update.component';
import { CompetanceRoutingResolveService } from './competance-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const competanceRoute: Routes = [
  {
    path: '',
    component: CompetanceComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CompetanceDetailComponent,
    resolve: {
      competance: CompetanceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CompetanceUpdateComponent,
    resolve: {
      competance: CompetanceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CompetanceUpdateComponent,
    resolve: {
      competance: CompetanceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(competanceRoute)],
  exports: [RouterModule],
})
export class CompetanceRoutingModule {}

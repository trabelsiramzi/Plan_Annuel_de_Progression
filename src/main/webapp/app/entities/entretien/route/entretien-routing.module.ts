import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { EntretienComponent } from '../list/entretien.component';
import { EntretienDetailComponent } from '../detail/entretien-detail.component';
import { EntretienUpdateComponent } from '../update/entretien-update.component';
import { EntretienRoutingResolveService } from './entretien-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const entretienRoute: Routes = [
  {
    path: '',
    component: EntretienComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EntretienDetailComponent,
    resolve: {
      entretien: EntretienRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EntretienUpdateComponent,
    resolve: {
      entretien: EntretienRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EntretienUpdateComponent,
    resolve: {
      entretien: EntretienRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(entretienRoute)],
  exports: [RouterModule],
})
export class EntretienRoutingModule {}

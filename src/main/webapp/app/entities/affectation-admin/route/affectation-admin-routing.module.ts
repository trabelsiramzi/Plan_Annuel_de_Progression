import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AffectationAdminComponent } from '../list/affectation-admin.component';
import { AffectationAdminDetailComponent } from '../detail/affectation-admin-detail.component';
import { AffectationAdminUpdateComponent } from '../update/affectation-admin-update.component';
import { AffectationAdminRoutingResolveService } from './affectation-admin-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const affectationAdminRoute: Routes = [
  {
    path: '',
    component: AffectationAdminComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AffectationAdminDetailComponent,
    resolve: {
      affectationAdmin: AffectationAdminRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AffectationAdminUpdateComponent,
    resolve: {
      affectationAdmin: AffectationAdminRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AffectationAdminUpdateComponent,
    resolve: {
      affectationAdmin: AffectationAdminRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(affectationAdminRoute)],
  exports: [RouterModule],
})
export class AffectationAdminRoutingModule {}

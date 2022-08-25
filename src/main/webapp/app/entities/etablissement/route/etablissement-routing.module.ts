import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { EtablissementComponent } from '../list/etablissement.component';
import { EtablissementDetailComponent } from '../detail/etablissement-detail.component';
import { EtablissementUpdateComponent } from '../update/etablissement-update.component';
import { EtablissementRoutingResolveService } from './etablissement-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const etablissementRoute: Routes = [
  {
    path: '',
    component: EtablissementComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EtablissementDetailComponent,
    resolve: {
      etablissement: EtablissementRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EtablissementUpdateComponent,
    resolve: {
      etablissement: EtablissementRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EtablissementUpdateComponent,
    resolve: {
      etablissement: EtablissementRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(etablissementRoute)],
  exports: [RouterModule],
})
export class EtablissementRoutingModule {}

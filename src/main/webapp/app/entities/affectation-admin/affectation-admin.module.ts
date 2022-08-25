import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AffectationAdminComponent } from './list/affectation-admin.component';
import { AffectationAdminDetailComponent } from './detail/affectation-admin-detail.component';
import { AffectationAdminUpdateComponent } from './update/affectation-admin-update.component';
import { AffectationAdminDeleteDialogComponent } from './delete/affectation-admin-delete-dialog.component';
import { AffectationAdminRoutingModule } from './route/affectation-admin-routing.module';

@NgModule({
  imports: [SharedModule, AffectationAdminRoutingModule],
  declarations: [
    AffectationAdminComponent,
    AffectationAdminDetailComponent,
    AffectationAdminUpdateComponent,
    AffectationAdminDeleteDialogComponent,
  ],
})
export class AffectationAdminModule {}

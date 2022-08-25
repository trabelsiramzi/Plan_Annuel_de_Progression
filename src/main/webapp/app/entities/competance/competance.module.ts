import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CompetanceComponent } from './list/competance.component';
import { CompetanceDetailComponent } from './detail/competance-detail.component';
import { CompetanceUpdateComponent } from './update/competance-update.component';
import { CompetanceDeleteDialogComponent } from './delete/competance-delete-dialog.component';
import { CompetanceRoutingModule } from './route/competance-routing.module';

@NgModule({
  imports: [SharedModule, CompetanceRoutingModule],
  declarations: [CompetanceComponent, CompetanceDetailComponent, CompetanceUpdateComponent, CompetanceDeleteDialogComponent],
})
export class CompetanceModule {}

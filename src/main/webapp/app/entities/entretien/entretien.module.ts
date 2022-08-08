import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { EntretienComponent } from './list/entretien.component';
import { EntretienDetailComponent } from './detail/entretien-detail.component';
import { EntretienUpdateComponent } from './update/entretien-update.component';
import { EntretienDeleteDialogComponent } from './delete/entretien-delete-dialog.component';
import { EntretienRoutingModule } from './route/entretien-routing.module';

@NgModule({
  imports: [SharedModule, EntretienRoutingModule],
  declarations: [EntretienComponent, EntretienDetailComponent, EntretienUpdateComponent, EntretienDeleteDialogComponent],
})
export class EntretienModule {}

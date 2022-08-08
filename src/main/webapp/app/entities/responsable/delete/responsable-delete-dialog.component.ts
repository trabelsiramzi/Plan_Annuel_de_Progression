import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IResponsable } from '../responsable.model';
import { ResponsableService } from '../service/responsable.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './responsable-delete-dialog.component.html',
})
export class ResponsableDeleteDialogComponent {
  responsable?: IResponsable;

  constructor(protected responsableService: ResponsableService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.responsableService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}

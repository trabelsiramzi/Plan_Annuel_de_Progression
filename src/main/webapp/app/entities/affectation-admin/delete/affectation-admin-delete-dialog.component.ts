import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAffectationAdmin } from '../affectation-admin.model';
import { AffectationAdminService } from '../service/affectation-admin.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './affectation-admin-delete-dialog.component.html',
})
export class AffectationAdminDeleteDialogComponent {
  affectationAdmin?: IAffectationAdmin;

  constructor(protected affectationAdminService: AffectationAdminService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.affectationAdminService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}

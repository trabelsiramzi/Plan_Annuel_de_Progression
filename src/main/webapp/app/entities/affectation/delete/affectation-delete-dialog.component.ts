import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAffectation } from '../affectation.model';
import { AffectationService } from '../service/affectation.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './affectation-delete-dialog.component.html',
})
export class AffectationDeleteDialogComponent {
  affectation?: IAffectation;

  constructor(protected affectationService: AffectationService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.affectationService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}

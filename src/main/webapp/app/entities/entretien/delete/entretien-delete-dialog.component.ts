import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IEntretien } from '../entretien.model';
import { EntretienService } from '../service/entretien.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './entretien-delete-dialog.component.html',
})
export class EntretienDeleteDialogComponent {
  entretien?: IEntretien;

  constructor(protected entretienService: EntretienService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.entretienService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}

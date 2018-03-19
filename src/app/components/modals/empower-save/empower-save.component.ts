import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '@api';
import { UIStoreService } from '@ui';

@Component({
  selector: 'app-empower-save',
  templateUrl: './empower-save.component.html',
  styleUrls: ['./empower-save.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmpowerSaveComponent implements OnInit {

  public loanCurrentDocs$ = this.api.loanCurrentDocs$;
  public waiting = false;

  constructor(
    public activeModal: NgbActiveModal,
    public ui: UIStoreService,
    private api: ApiService
  ) { }

  ngOnInit() {
  }

  /**
   * Submit the form
   */
  submit() {
    this.activeModal.close('Success');
  } // end submit

}

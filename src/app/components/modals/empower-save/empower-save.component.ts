import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-empower-save',
  templateUrl: './empower-save.component.html',
  styleUrls: ['./empower-save.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmpowerSaveComponent implements OnInit {

  constructor(
    public activeModal: NgbActiveModal
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

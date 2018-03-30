import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
//import { ApiService } from '@api';
//import { UIStoreService } from '@ui';

@Component({
  selector: 'app-conditions',
  templateUrl: './conditions.component.html',
  styleUrls: ['./conditions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConditionsComponent implements OnInit {

  public condition: any;
  public condition2: any;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() { }

  /**
   * Submit the form
   */
  submit() {
    this.activeModal.close('Success');
  } // end submit

}

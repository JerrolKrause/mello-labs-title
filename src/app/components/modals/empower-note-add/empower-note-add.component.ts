import { Component, OnInit, ViewChild, OnDestroy, ViewEncapsulation } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { FormControl, Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

import { ApiService } from '@api';


@Component({
  selector: 'empower-note-add',
  styleUrls: ['./empower-note-add.component.scss'],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './empower-note-add.component.html'
})
export class EmpowerNoteAddComponent implements OnInit, OnDestroy {
  public formMain: FormGroup;
  public formMain2: FormGroup;
  public waiting: boolean = false;

  public noteTypes$;
  public error: IErrorApi;
  public data: any; // Data is actually passed through the modal service not here
  public data2: any;// Data is actually passed through the modal service not here
  private subscriptions: Subscription[] = [];
  public configValue: string[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private api: ApiService
  ) { }

  ngOnInit() {

    this.formMain = this.fb.group({ // <-- formGroup for LoanNotes
      subject: ['', [Validators.required]],
      description: ['', [Validators.required]],
      category: ['', []],
      lnkeys: [[this.data], [Validators.required]],
      loanNumber: [this.data, [Validators.required]]
    });

    this.formMain2 = this.fb.group({ // <-- formGroup for empower dashboard dates
      lastContacted: [null, [Validators.required]],
      introCall: [null, [Validators.required]],
      loanReview: [null, [Validators.required]],
      loanFunded: [null, [Validators.required]],
      appraisalReview: [null, [Validators.required]],
      hud1: [null, [Validators.required]],
      saveSettings: [null, [Validators.required]],
    });

  }
  /**
   * Submit the form
   */
  submit() {
    this.waiting = true;
    this.error = null;
    let _configValue = Object.keys(this.formMain2.value).filter(key => {
      if (this.formMain2.value[key] === true) {
        return key;
      }
    }).map(value => value.toLowerCase());
    let configValue: string = _configValue.toString().replace(/\,/ig, '|');

  }//end submit

  ngOnDestroy() {
    if (this.subscriptions.length) {
      this.subscriptions.forEach(subscription => {
        subscription.unsubscribe();
      });
    }
  }
}

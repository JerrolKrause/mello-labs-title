import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/forkJoin';

import { UIStoreService, FormTypes } from '@ui';
import { ApiService } from '@api'

@Component({
  selector: 'app-borrower',
  templateUrl: './borrower.component.html',
  styleUrls: ['./borrower.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BorrowerComponent implements OnInit {

  public formBorrower: FormGroup;
  @Output() formRef: EventEmitter<FormGroup> = new EventEmitter();

  public dateLastRecorded;
  private subs: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    public ui: UIStoreService,
    private api: ApiService,
  ) { }

  ngOnInit() {
    this.formBorrower = this.fb.group({
      borrower: [null, [Validators.required]],
      maritalStatus: [null, [Validators.required]]
    });

    // Load the value currently in the store and then unsub
    // Initial load data is being added to store from route component
    this.ui.formBorrower$.subscribe(form => {
      if (form){
        this.formBorrower.reset();
        this.formBorrower.patchValue(form);
      }
    }).unsubscribe();

    this.subs.push(
      // Watch form changes, update value in UI store
      this.formBorrower.valueChanges.subscribe(formNew => {
        this.ui.formChange(FormTypes.borrower, { ...formNew }, true);
      })
    );

    // Pass reference to parent
    this.formRef.emit(this.formBorrower);

  }

  public conditionAdd() {

  }

  /**
   * Change a value in the form
   * @param field
   * @param propNew
   */
  public updateForm(field: string, propNew: string) {
    let valNew = {};
    valNew[field] = propNew;
    this.formBorrower.patchValue(valNew);
  }

}

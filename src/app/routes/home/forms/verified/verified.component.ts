import { Component, OnInit, ChangeDetectionStrategy, EventEmitter, Output, Input, OnDestroy, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/forkJoin';

import { UIStoreService, FormTypes } from '@ui';
import { ApiService } from '@api'

@Component({
  selector: 'app-verified',
  templateUrl: './verified.component.html',
  styleUrls: ['./verified.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VerifiedComponent implements OnInit, OnDestroy {

  public formVerified: FormGroup;
  public loanCurrent$ = this.api.loanCurrent$;
  public loanCurrentOcr$ = this.api.loanCurrentOcr$;
  public loanCurrentStatus$ = this.api.loanCurrentStatus$;
  @Output() formRef: EventEmitter<FormGroup> = new EventEmitter();

  private subs: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    public ui: UIStoreService,
    private api: ApiService,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit() {
    
    this.formVerified = this.fb.group({
      Borrower: [null, [Validators.required]],
      MaritalStatusName: [null, [Validators.required]],
      LoanPurposeName: [null, [Validators.required]],
      FullNameVesting: [null, [Validators.required]],
      LoanTypeName: [null, [Validators.required]],
      TitleVendor: [null, [Validators.required]],
      OwnershipTypeName: [null, [Validators.required]],
      PropertyTypeName: [null, [Validators.required]],
      CurrentMortgage: [null, [Validators.required]],
      APN: [null, [Validators.required]]
    });

    this.subs.push(
      // Watch form changes, update value in UI store
      this.formVerified.valueChanges.subscribe(formNew => {
        this.ui.formChange(FormTypes.vesting, { ...formNew },true);
      }),
      // Load the value currently in the store and then unsub
    // Initial load data is being added to store from route component
      this.api.loanCurrent$.subscribe(form => {
        if (form) {
          this.formVerified.reset();
          this.formVerified.patchValue(form);
        }
      })
    );

    // Pass reference to parent
    this.formRef.emit(this.formVerified);
  }

  /**
   * Change a value in the form
   * @param field
   * @param propNew
   */
  public updateForm(field: string, propNew: string) {
    let valNew = {};
    valNew[field] = propNew;
    this.formVerified.patchValue(valNew);
  }

  /**
 * Transform date supplied by datepicker to reactive form model
 * @param field
 * @param date
 */
  public dateChanged(field: 'dateLastRecorded', date) {
    let dateNew = date.month + '/' + date.day + '/' + date.year;
    this.updateForm(field, dateNew);
  }

  ngOnDestroy() {
    if (this.subs.length) { this.subs.forEach(sub => sub.unsubscribe()) }
  }

}

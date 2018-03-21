import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/forkJoin';

import { UIStoreService, FormTypes } from '@ui';
import { ApiService } from '@api'

@Component({
  selector: 'app-exceptions',
  templateUrl: './exceptions.component.html',
  styleUrls: ['./exceptions.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExceptionsComponent implements OnInit {

  public formExceptions: FormGroup;
  @Output() formRef: EventEmitter<FormGroup> = new EventEmitter();

  public loanCurrent$ = this.api.loanCurrent$;
  public loanCurrentOcr$ = this.api.loanCurrentOcr$;
  public loanCurrentStatus$ = this.api.loanCurrentStatus$;

  public dateLastRecorded;
  public editing = {
    borrower: null
  };
  private subs: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    public ui: UIStoreService,
    private api: ApiService,
  ) { }

  ngOnInit() {

    this.formExceptions = this.fb.group({

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
      // Load the value currently in the store and then unsub
      // Initial load data is being added to store from route component
      this.api.loanCurrent$.subscribe(form => {
        if (form) {
          this.formExceptions.reset();
          this.formExceptions.patchValue(form);
        }
      }),
      // Watch form changes, update value in UI store
      this.formExceptions.valueChanges.subscribe(formNew => {
        this.ui.formChange(FormTypes.borrower, { ...formNew }, true);
      })
    );

    // Pass reference to parent
    this.formRef.emit(this.formExceptions);

  }


  /**
   * Change a value in the form
   * @param field
   * @param propNew
   */
  public updateForm(field: string, propNew: string) {
    this.editing[field] = false;
    let valNew = {};
    valNew[field] = propNew;
    this.formExceptions.patchValue(valNew);
  }

}

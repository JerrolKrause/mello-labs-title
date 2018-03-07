import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { CurrencyPipe } from '@angular/common'

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { UIStoreService, FormTypes } from '@ui';
import { ApiService } from '@api'

@Component({
  selector: 'app-loan-info',
  templateUrl: './loan-info.component.html',
  styleUrls: ['./loan-info.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoanInfoComponent implements OnInit {

  public formInfo: FormGroup;
  @Output() formRef: EventEmitter<FormGroup> = new EventEmitter();

  public dateEffective;
  public dateExpiration;

  private subs: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    public ui: UIStoreService,
    private api: ApiService,
    private cp: CurrencyPipe
  ) { }

  ngOnInit() {
    this.formInfo = this.fb.group({
      lnkey: [{value:null, disabled: true}, [Validators.required]],
      name: [null, [Validators.required]],
      loanAmount: [null, [Validators.required]],
      dateEffective: [null, [Validators.required]],
      dateExpiration: [null, [Validators.required]]
    });

    // Load the value currently in the store and then unsub
    // Initial load data is being added to store from route component
    this.ui.formLoan$.subscribe(form => {
      if (form){
        this.formInfo.reset();
        this.formInfo.patchValue({ ...form, loanAmount: this.cp.transform(form.loanAmount) });
      }
    }).unsubscribe();

    this.subs.push(
      // Watch form changes, update value in UI store
      this.formInfo.valueChanges.subscribe(formNew => {
        this.ui.formChange(FormTypes.info, { ...formNew }, true);
      })
    );

    // Pass reference to parent
    this.formRef.emit(this.formInfo);
  }

  /**
   * Change a value in the form
   * @param field
   * @param propNew
   */
  public updateForm(field: string, propNew: string) {
    let valNew = {};
    valNew[field] = propNew;
    this.formInfo.patchValue(valNew);
  }

  /**
   * Transform date supplied by datepicker to reactive form model
   * @param field
   * @param date
   */
  public dateChanged(field: 'dateEffective' | 'dateExpiration', date) {
    let dateNew = date.month + '/' + date.day + '/' + date.year;
    this.updateForm(field,dateNew);
  }

  /**
   * Save loan
   */
  public loanSave() {
    this.ui.loanSaved();
  }

  ngOnDestroy() {
    if (this.subs.length) { this.subs.forEach(sub => sub.unsubscribe()) }
  }

  

}

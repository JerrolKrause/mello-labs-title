import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation, ViewChild, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { NgbTab, NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { ApiService, ApiProps } from '@api'
import { UIStoreService, FormTypes } from '@ui'
import { Subscription } from 'rxjs/Subscription';


@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormsComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('tab') tab: NgbTabset;

  /** Set initial visible tab from UI store */
  public tabStart: string;

  public lnkey: string;
  public loan;

  public formInfoStatus$ = this.api.getState$(ApiProps.loans);
  public formVestingStatus$ = this.api.getState$(ApiProps.vesting);
  public formVesting: FormBuilder;
  public formBorrower: FormBuilder;

  private subs: Subscription[] = [];

  constructor(
    public ui: UIStoreService,
    private api: ApiService,
    private ref: ChangeDetectorRef,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {

    this.api.loans.get().subscribe();
    this.api.loanCurrent.get().subscribe();
    this.api.loanCurrentOcr.get().subscribe();
    this.api.loanCurrentDocs.get().subscribe();

    this.subs.push(
      // On initial load, set the default open tab
      this.ui.tabForm$.subscribe(tabNum => this.tabStart = 'tab-' + tabNum),
      this.route.params.subscribe(params => this.lnkey = params.lnkey),
      this.api.loans$.subscribe(loans => {
        if (loans && loans.dict) {
          this.loan = loans.dict[this.lnkey];
          this.ref.detectChanges();
        }
      })
    );

  }

  ngAfterViewInit() {
    this.subs.push(
      // On tab change, update UI store
      this.tab.tabChange.subscribe(tabNum => {
        this.ui.tabChange('form', Number(tabNum.nextId.split('-')[1]));
      })
    );
  }

  /**
   * When a reactive form reference is emitted up from a child component, attach to a property here
   * @param formType
   * @param form
   */
  public formRef(formType: FormTypes, form: FormBuilder) {
    // console.log('formRef', formType, form);

    switch (formType) {
      case FormTypes.vesting:
        this.formVesting = form;
        break;
      case FormTypes.borrower:
        this.formBorrower = form;
        break;
    }
    this.ref.detectChanges();
  }

  ngOnDestroy() {
    if (this.subs.length) { this.subs.forEach(sub => sub.unsubscribe()) }
  }

}

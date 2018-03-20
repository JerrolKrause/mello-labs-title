import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { ApiService, ApiProps } from '@api'
import { UIStoreService, FormTypes } from '@ui'
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-loan',
  templateUrl: './loan.component.html',
  styleUrls: ['./loan.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoanComponent implements OnInit {

  public lnkey: string;
  private subs: Subscription[] = [];
  private screen;

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
      
      // Get LNkey from route params
      this.route.params.subscribe(params => this.lnkey = params.lnkey),
      this.ui.multiScreen$.subscribe(multiScreen => {
        if (multiScreen) {
          this.ui.screen = window.open(window.location.origin + '/#/viewer/' + this.lnkey, 'Document Viewer')
        } else if (this.ui.screen && multiScreen === false) {
          this.ui.screen.close();
        }
      }),
      // Load active loan form into store
      this.api.loans$.subscribe(loans => {
        if (loans && loans.dict) {
          this.ui.formChange(FormTypes.loan, loans.dict[this.lnkey]);
        }
      }),
      // Load vesting form info into store
      this.api.vesting.get(true).subscribe(form => {
        this.ui.formChange(FormTypes.vesting, form);
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

    this.ref.detectChanges();
  }

  ngOnDestroy() {
    if (this.subs.length) { this.subs.forEach(sub => sub.unsubscribe()) }
  }

}

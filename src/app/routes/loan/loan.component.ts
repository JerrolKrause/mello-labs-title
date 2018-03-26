import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { ApiService, ApiProps } from '@api'
import { UIStoreService, FormTypes } from '@ui'
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { PostMessageService, AppSettings } from '@shared';

@Component({
  selector: 'app-loan',
  templateUrl: './loan.component.html',
  styleUrls: ['./loan.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoanComponent implements OnInit, AfterViewInit {

  public loan;

  public contacts$ = this.api.contacts$;
  public loanContacts$ = this.ui.loanContacts$
  public loanCurrent$ = this.api.loanCurrent$;
  public loanCurrentOcr$ = this.api.loanCurrentOcr$;

  public exceptionCleared = false;
  private slug = window.location.origin + window.location.pathname;
  private subs: Subscription[] = [];

  constructor(
    public ui: UIStoreService,
    private api: ApiService,
    private ref: ChangeDetectorRef,
    private route: ActivatedRoute,
    private messaging: PostMessageService,
    public settings: AppSettings
  ) { }

  ngOnInit() {

    this.api.loans.get().subscribe();

    this.api.loanCurrent.get().subscribe();
    this.api.loanCurrentOcr.get().subscribe();
    this.api.loanCurrentDocs.get().subscribe();

    // Reset doc guid every time this component is loaded
    this.ui.docViewerChange(0, null);
    this.ui.docViewerChange(1, null);

    this.subs.push(
      // Get LNkey from route params
      this.route.params.subscribe(params => this.settings.lnkey = params.lnkey),
      this.api.loans$.subscribe(loans => {
        if (loans) {
          this.loan = loans.dict[this.settings.lnkey];
        }
      }),
      // Manage multiscreen functionality
      //this.ui.multiScreen$.subscribe(multiScreen => {
      //  // If multiscreen is present and a window is not yet open and has not been closed
      //  if (multiScreen && !this.ui.screen) {
      //    setTimeout(() => {
      //      this.ui.screen = window.open(this.slug + '#/viewer/' + this.lnkey, 'Document Viewer');
      //    });
      //  }
      //  // If window has been closed
      //  else if (this.ui.screen && this.ui.screen.closed) {
      //    this.ui.screen = null;
      //  }
      //  // If multi screen has been set and a window is already opened, update url in current window
      //  else if (multiScreen && this.ui.screen) {
      //    setTimeout(() => {
      //      this.ui.screen.location.href = this.slug + '#/viewer/' + this.lnkey, 'Document Viewer';
      //    });
      //  }
      //  // If screen is open and multiscreen is false, close window
      //  else if (this.ui.screen && multiScreen === false) {
      //    this.ui.screen.close();
      //    this.ui.screen = null;
      //  }
      //}),
      // Load active loan form into store
      this.api.loans$.subscribe(loans => {
        if (loans && loans.dict) {
          this.ui.formChange(FormTypes.loan, loans.dict[this.settings.lnkey]);
        }
      })
    );

    // Get loan contacts
    this.api.contacts.get(this.settings.lnkey).subscribe()
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


  ngAfterViewInit() {  }

  ngOnDestroy() {
    if (this.ui.screen && !this.ui.screen.closed) {
      this.ui.screen.location.href = this.slug + '#/viewer/', 'Document Viewer';
    }
    this.settings.lnkey = null;

    if (this.subs.length) { this.subs.forEach(sub => sub.unsubscribe()) }
  }

}

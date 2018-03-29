import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';

import { ApiService } from '@api'
import { UIStoreService, FormTypes } from '@ui'
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute } from '@angular/router';
import { AppSettings, AppCommsService } from '@shared';

@Component({
  selector: 'app-loan',
  templateUrl: './loan.component.html',
  styleUrls: ['./loan.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoanComponent implements OnInit, AfterViewInit {

  @ViewChild('tab') tab: NgbTabset;

  public loan:any;

  public contacts$ = this.api.contacts$;
  public loanContacts$ = this.ui.loanContacts$
  public loanCurrent$ = this.api.loanCurrent$;
  public loanCurrentOcr$ = this.api.loanCurrentOcr$;

  public tabStart = 'tab-1';

  public webLinks = [
    {
      label: 'USPS Address Verification',
      url: 'https://tools.usps.com/go/ZipLookupResultsAction!input.action'
    },
    {
      label: 'Title Request Form',
      url: 'http://ldcorp/dept/IT/SitePages/Home.aspx'
    },
  ];

  public exceptionCleared = false;
  private slug = window.location.origin + window.location.pathname;
  private subs: Subscription[] = [];

  constructor(
    public ui: UIStoreService,
    private api: ApiService,
    private ref: ChangeDetectorRef,
    private route: ActivatedRoute,
    public settings: AppSettings,
    private comms: AppCommsService
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
      this.route.params.subscribe(params => {
        this.settings.lnkey = params.lnkey;
        this.comms.multiScreenState(); // Update multiscreen if present
      }),
      this.api.loans$.subscribe(loans => {
        if (loans && this.settings.lnkey) {
          this.loan = loans.dict[this.settings.lnkey];
        }
      }),
      // Load active loan form into store
      this.api.loans$.subscribe(loans => {
        if (loans && loans.dict && this.settings.lnkey) {
          this.ui.formChange(FormTypes.loan, loans.dict[this.settings.lnkey]);
        }
      }),
      // Initial visible tab
      this.ui.tabForm$.subscribe(tabNum => this.tabStart = 'tab-' + tabNum)
    );

    // Get loan contacts
    if (this.settings.lnkey){
      this.api.contacts.get(this.settings.lnkey).subscribe()
    }

    
  }

  public windowOpen(url: string) {
    window.open(url);
  }

  /**
   * When a reactive form reference is emitted up from a child component, attach to a property here
   * @param formType
   * @param form
   */
  public formRef(formType: FormTypes, form: FormBuilder) {
     console.log('formRef', formType, form);
    this.ref.detectChanges();
  }


  ngAfterViewInit() {
  // On tab change, update UI store
    if (this.tab){
      this.subs.push(
        this.tab.tabChange.subscribe((tabNum:any) => {
          this.ui.tabChange('form', Number(tabNum.nextId.split('-')[1]));
        })
      );
    }
  }

  ngOnDestroy() {
    if (this.ui.screen && !this.ui.screen.closed) {
      this.ui.screen.location.href = this.slug + '#/viewer/', 'Document Viewer';
    }
    this.settings.lnkey = null;

    if (this.subs.length) { this.subs.forEach(sub => sub.unsubscribe()) }
  }

}

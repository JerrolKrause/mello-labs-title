import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { ApiService, ApiProps } from '@api'
import { UIStoreService, FormTypes } from '@ui'
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'app-loan',
  templateUrl: './loan.component.html',
  styleUrls: ['./loan.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoanComponent implements OnInit {

  public lnkey: string;
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

    // Reset doc guid every time this component is loaded
    this.ui.docViewerChange(0, null);
    this.ui.docViewerChange(1, null);

    this.subs.push(

      // Get LNkey from route params
      this.route.params.subscribe(params => this.lnkey = params.lnkey),
      // Manage multiscreen functionality
      Observable.combineLatest(this.ui.multiScreen$, this.ui.docViewerGuids$).subscribe(res => {
        let multiScreen: boolean = res[0];
        let docGuid: string = res[1][0];
        // If a doc guid is present, add that to the route parameters
        let docGuidString = docGuid ? '/' + docGuid : '';
        let slug = window.location.origin + window.location.pathname;

        // If multiscreen is present and a window is not yet open and has not been closed
        if (multiScreen && !this.ui.screen) {
          this.ui.screen = window.open(slug + '#/viewer/' + this.lnkey + docGuidString, 'Document Viewer');
        }
        // If window has been closed
        else if (this.ui.screen && this.ui.screen.closed) {
          this.ui.screen = null;
        }
        // If multi screen has been set and a window is already opened, update url in current window
        else if (multiScreen && this.ui.screen) {
          this.ui.screen.location.href = slug + '#/viewer/' + this.lnkey + docGuidString, 'Document Viewer';
        }
        // If screen is open and multiscreen is false, close window
        else if (this.ui.screen && multiScreen === false) {
          this.ui.screen.close();
        }
      }),
      // Load active loan form into store
      this.api.loans$.subscribe(loans => {
        if (loans && loans.dict) {
          this.ui.formChange(FormTypes.loan, loans.dict[this.lnkey]);
        }
      }),

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

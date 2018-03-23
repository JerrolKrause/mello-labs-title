import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation, AfterViewInit } from '@angular/core';

import { ApiService, ApiProps } from '@api'
import { UIStoreService, FormTypes } from '@ui'
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Router } from '@angular/router';

import { PostMessageService } from '@shared';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewerComponent implements OnInit, AfterViewInit {

  public loanCurrentDocs$ = this.api.loanCurrentDocs$;
  public loanCurrentDocsStatus$ = this.api.getState$(ApiProps.loanCurrentDocs);

  public isStandalone = false;
  public lnkey: string;
  private subs: Subscription[] = [];

  constructor(
    public ui: UIStoreService,
    private api: ApiService,
    private ref: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private messaging: PostMessageService
  ) { }

  ngOnInit() {

    this.api.loanCurrent.get().subscribe();
    this.api.loanCurrentDocs.get().subscribe();

    if (this.router.url.indexOf('viewer') != -1) {
      this.isStandalone = true;
    }

    this.subs.push(
      // Get LNkey from route params
      this.route.params.subscribe(params => this.lnkey = params.lnkey),
      // Load active loan form into store
      this.api.loans$.subscribe(loans => {
        if (loans && loans.dict) {
          this.ui.formChange(FormTypes.loan, loans.dict[this.lnkey]);
        }
      }),
     
    );
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.messaging.postMessage('iframe', {}, '*', 'pdfViewer');
    });
  }

  ngOnDestroy() {
    if (this.subs.length) { this.subs.forEach(sub => sub.unsubscribe()) }
  }

}

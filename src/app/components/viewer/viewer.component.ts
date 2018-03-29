import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation, AfterViewInit } from '@angular/core';

import { ApiService, ApiProps } from '@api'
import { UIStoreService, FormTypes } from '@ui'
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Router } from '@angular/router';

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
    private route: ActivatedRoute,
    private router: Router
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
    //console.log('Posting and listening for messages');
    //this.messaging.listenForMessages().subscribe(message => {
    //  console.log('listenForMessages', message);
    //});
    //  setTimeout(() => {
    //    this.messaging.postMessage('iframe', { event: 'Test', payload: 'Test' }, '*', 'pdfViewer');
    //    this.messaging.postMessage('url', { event: 'Test2', payload: 'Test2' }, '*');
    //}, 1000);
  }

  ngOnDestroy() {
    if (this.subs.length) { this.subs.forEach(sub => sub.unsubscribe()) }
  }

}

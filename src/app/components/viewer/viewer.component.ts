import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';

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
export class ViewerComponent implements OnInit {

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
    private router: Router
  ) { }

  ngOnInit() {

    this.api.loanCurrent.get().subscribe();
    this.api.loanCurrentDocs.get().subscribe();

    if (this.router.url.indexOf('viewer') != -1) {
      this.isStandalone = true;
    }

    console.log(this.router.url)

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

  ngOnDestroy() {
    if (this.subs.length) { this.subs.forEach(sub => sub.unsubscribe()) }
  }

}

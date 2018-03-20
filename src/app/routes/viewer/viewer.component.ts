import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';

import { ApiService, ApiProps } from '@api'
import { UIStoreService, FormTypes } from '@ui'
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewerComponent implements OnInit {

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

    this.subs.push(
      // Get LNkey from route params
      this.route.params.subscribe(params => this.lnkey = params.lnkey),
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

  ngOnDestroy() {
    if (this.subs.length) { this.subs.forEach(sub => sub.unsubscribe()) }
  }

}

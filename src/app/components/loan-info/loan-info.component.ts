import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

import { UIStoreService } from '@ui';
import { ApiService } from '@api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loan-info',
  templateUrl: './loan-info.component.html',
  styleUrls: ['./loan-info.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoanInfoComponent implements OnInit {
  public lnkey: string;

  public loanCurrent$ = this.api.loanCurrent$;

  constructor(public ui: UIStoreService, private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.api.loanCurrent.get().subscribe();
  }

  /**
   * When an exception is added
   * @param $event
   */
  public exceptionAdded() {
    this.router.navigate(['/']);
  }

  /**
   * Save loan
   */
  public loanSave() {
    this.ui.loanSaved();
  }

}

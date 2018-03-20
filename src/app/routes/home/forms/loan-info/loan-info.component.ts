import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { CurrencyPipe } from '@angular/common'

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { UIStoreService, FormTypes } from '@ui';
import { ApiService } from '@api'
import { Router } from '@angular/router';

@Component({
  selector: 'app-loan-info',
  templateUrl: './loan-info.component.html',
  styleUrls: ['./loan-info.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoanInfoComponent implements OnInit {

  public formInfo: FormGroup;
  @Output() formRef: EventEmitter<FormGroup> = new EventEmitter();
  public lnkey: string;
  public dateEffective;
  public dateExpiration;

  public loanCurrent$ = this.api.loanCurrent$;

  private subs: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    public ui: UIStoreService,
    private api: ApiService,
    private cp: CurrencyPipe,
    private router: Router
  ) { }

  ngOnInit() {
    this.api.loanCurrent.get().subscribe();
  }

  /**
   * When an exception is added
   * @param $event
   */
  public exceptionAdded($event) {
    this.router.navigate(['/']);
  }

  /**
   * Save loan
   */
  public loanSave() {
    this.ui.loanSaved();
  }

  ngOnDestroy() {
    if (this.subs.length) { this.subs.forEach(sub => sub.unsubscribe()) }
  }

  

}

import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import * as _ from 'lodash';
import { Datagrid } from '@mello-labs/datagrid';

import { ApiService, ApiProps } from '@api';
import { UIStoreService } from '@ui';

declare var require: any

@Component({
  selector: 'app-home',
  styleUrls: ['./home.component.scss'],
  templateUrl: './home.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit, OnDestroy {

  public rows$ = this.api.loans$;
  public columns: Datagrid.Column[] = require('./columns.users.json');
  public state: Datagrid.State = { "filters": [], "sorts": [{ dir: "asc", prop: "complete" }], "groups": [] };//{ dir: "asc", prop: "certification" }
  // Inputs
  public options: Datagrid.Options = {
    selectionType: false,
    fullScreen: true,
    controlsDropdown: true,
    showInfo: true
  }

  public filterGlobal = {
    term: null,
    props: ['lnkey', 'name']
  };

  /** Hold subs for unsub */
  private subs: Subscription[] = [];

  constructor(
    private api: ApiService,
    public ui: UIStoreService,
    private fb: FormBuilder
  ) {
  }

  public ngOnInit() {
    this.api.loans.get().subscribe();
    this.rows$.subscribe(rows => console.log(rows));
  }

  /**
	 * Update the global filter term
	 * @param searchTerm
	 */
  public onfilterGlobal(searchTerm: string = null) {
    this.filterGlobal = { ...this.filterGlobal, term: searchTerm };
  }

  public onStateChange(state) {
  }

  ngOnDestroy() {
    if (this.subs.length) { this.subs.forEach(sub => sub.unsubscribe()); } // Unsub
  }

}

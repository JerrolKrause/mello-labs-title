import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ViewEncapsulation, AfterViewInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { NgbTab, NgbTabset } from '@ng-bootstrap/ng-bootstrap';
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
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('tab') tab: NgbTabset;

  public rows;
  public columns: Datagrid.Column[] = require('./columns.loans.json');
  public columnsExceptions: Datagrid.Column[] = require('./columns.exceptions.json');
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

  /** Set initial visible tab from UI store */
  public tabStart: string;

  /** Hold subs for unsub */
  private subs: Subscription[] = [];

  constructor(
    private api: ApiService,
    public ui: UIStoreService,
    private fb: FormBuilder,
    private ref: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.api.loans.get().subscribe();
    this.subs.push(
      this.api.loans$.subscribe(rows => {
        this.rows = rows;
        this.ref.detectChanges();
      }),
      // On initial load, set the default open tab
      this.ui.tabDashboard$.subscribe(tabNum => this.tabStart = 'tab-' + tabNum),
    );
  }

  ngAfterViewInit() {
    this.subs.push(
      // On tab change, update UI store
      this.tab.tabChange.subscribe(tabNum => {
        this.ui.tabChange('dashboard', Number(tabNum.nextId.split('-')[1]));
      })
    );
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

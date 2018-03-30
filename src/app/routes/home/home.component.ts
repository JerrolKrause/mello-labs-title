import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  ViewEncapsulation,
  AfterViewInit,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs/Subscription';
import { Datagrid } from '@mello-labs/datagrid';

import { ApiService } from '@api';
import { UIStoreService } from '@ui';

declare var require: any;

@Component({
  selector: 'app-home',
  styleUrls: ['./home.component.scss'],
  templateUrl: './home.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('tab') tab: NgbTabset;

  public rows: any;
  public columns: Datagrid.Column[] = require('./columns.loans.json');
  public columnsExceptions: Datagrid.Column[] = require('./columns.exceptions.json');
  public columnsResubmissions: Datagrid.Column[] = require('./columns.resubmissions.json');
  public state: Datagrid.State = { filters: [], sorts: [{ dir: 'asc', prop: 'complete' }], groups: [] }; //{ dir: "asc", prop: "certification" }
  // Inputs
  public options: Datagrid.Options = {
    selectionType: false,
    fullScreen: true,
    controlsDropdown: true,
    showInfo: true,
  };

  public filterGlobal = {
    term: '',
    props: ['lnkey', 'name'],
  };

  /** Set initial visible tab from UI store */
  public tabStart: string;

  /** Hold subs for unsub */
  private subs: Subscription[] = [];

  constructor(private api: ApiService, public ui: UIStoreService, private ref: ChangeDetectorRef) {}

  ngOnInit() {
    this.api.loans.get().subscribe();
    this.subs.push(
      this.api.loans$.subscribe(rows => {
        this.rows = rows;
        this.ref.detectChanges();
      }),
      // On initial load, set the default open tab
      this.ui.tabDashboard$.subscribe(tabNum => (this.tabStart = 'tab-' + tabNum)),
    );
  }

  ngAfterViewInit() {
    this.subs.push(
      // On tab change, update UI store
      this.tab.tabChange.subscribe((tabNum: any) => {
        this.ui.tabChange('dashboard', Number(tabNum.nextId.split('-')[1]));
      }),
    );
  }

  /**
   * Update the global filter term
   * @param searchTerm
   */
  public onfilterGlobal(searchTerm: string) {
    this.filterGlobal = { ...this.filterGlobal, term: searchTerm };
  }

  public onStateChange() {
    //state:any
  }

  ngOnDestroy() {
    if (this.subs.length) {
      this.subs.forEach(sub => sub.unsubscribe());
    } // Unsub
  }
}

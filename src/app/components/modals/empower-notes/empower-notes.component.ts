import { Component, OnInit, ChangeDetectionStrategy, ViewChild, EventEmitter } from '@angular/core';
import { NgbActiveModal, NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { Datagrid } from '@mello-labs/datagrid';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ApiService } from '@api';

@Component({
  selector: 'app-empower-notes',
  templateUrl: './empower-notes.component.html',
  styleUrls: ['./empower-notes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmpowerNotesComponent implements OnInit {
  public data: any; // Data is actually passed through the modal service not here
  public dataAlt: any; // Data is actually passed through the modal service not here
  public onSuccess: EventEmitter<any> = new EventEmitter();
  public formMain: FormGroup;

  public notes$ = this.api.notes$;
  public waiting = false;
  /** Reference to datagrid */
  @ViewChild('dataGrid') dataGrid: any;
  @ViewChild('tabs') tabs: NgbTabset;

  public options: Datagrid.Options = {
    scrollbarH: false,
    heightMax: 500,
    selectionType: false,
    controlsDropdown: true,
    primaryKey: 'noteDate',
  };

  public columns: Datagrid.Column[] = [
    // { prop: 'noteAge', label: 'Note Age', canSort: true, canGroup: true, columnType: 'duration', canFilter: false, canSearch: false },
    {
      prop: 'noteDate',
      label: 'Note Date',
      canSort: true,
      canGroup: true,
      columnType: 'dateTime',
      canFilter: true,
      canSearch: true,
    },
    {
      prop: 'subject',
      label: 'Subject',
      columnType: 'string',
      canSort: true,
      canGroup: true,
      canFilter: true,
      canSearch: true,
    },
    {
      prop: 'description',
      label: 'Description',
      columnType: 'string',
      canSort: true,
      canGroup: true,
      canFilter: true,
      canSearch: true,
    },
    {
      prop: 'category',
      label: 'Category',
      columnType: 'string',
      canSort: true,
      canGroup: true,
      canFilter: true,
      canSearch: true,
    },
    {
      prop: 'lastModUser',
      label: 'Added By',
      columnType: 'string',
      canSort: true,
      canGroup: true,
      canFilter: true,
      canSearch: true,
    },
  ];

  public filterGlobal: Datagrid.FilterGlobal = {
    term: '',
    props: ['subject', 'description'],
  };

  constructor(public activeModal: NgbActiveModal, private api: ApiService, private fb: FormBuilder) {
    this.formMain = this.fb.group({
      // <-- formGroup for LoanNotes
      subject: ['', [Validators.required]],
      description: ['', [Validators.required]],
      category: ['', []],
      lnkeys: [[this.data], [Validators.required]],
      loanNumber: [this.data, [Validators.required]],
    });
  }

  ngOnInit() {
    this.api.notes.get(this.data).subscribe();
  }

  /**
   * Update the global filter term
   * @param searchTerm
   */
  public onfilterGlobal(searchTerm: string) {
    this.filterGlobal = { ...this.filterGlobal, term: searchTerm };
  }

  /**
   * Submit the form
   */
  submit() {
    this.activeModal.close('Success');
  } // end submit
}

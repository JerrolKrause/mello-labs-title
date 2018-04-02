import { Component, OnInit, ChangeDetectionStrategy, Input, OnChanges, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-loan-contacts',
  templateUrl: './loan-contacts.component.html',
  styleUrls: ['./loan-contacts.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoanContactsComponent implements OnInit, OnChanges {
  @Input() contacts: any[];
  @Input() loanNumber: string;

  constructor() {}

  ngOnInit() {}

  ngOnChanges() {
    console.log(this.contacts);
  }

  public openEmpowerNotes(a: any, b: any, c: any) {
    console.log(a, b, c);
  }

  public copyToClipboard(phone: string) {
    console.log(phone);
  }

}

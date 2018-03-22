import { Component, OnInit, ChangeDetectionStrategy, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-loan-contacts',
  templateUrl: './loan-contacts.component.html',
  styleUrls: ['./loan-contacts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoanContactsComponent implements OnInit, OnChanges {

  @Input() contacts: any[];
  @Input() loanNumber: string;
  
  constructor() { }

  ngOnInit() {
    
  }

  ngOnChanges() {
    console.log(this.contacts)
  }

}

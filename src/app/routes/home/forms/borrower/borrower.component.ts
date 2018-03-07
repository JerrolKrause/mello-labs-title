import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { UIStoreService } from '@ui';

@Component({
  selector: 'app-borrower',
  templateUrl: './borrower.component.html',
  styleUrls: ['./borrower.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BorrowerComponent implements OnInit {


  public maritalStatus = 'Married'
  public borrower = 'John Smith\nJane Smith';

  constructor(
    public ui: UIStoreService
  ) { }

  ngOnInit() {
  }

}

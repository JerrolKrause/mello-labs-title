import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { UIStoreService } from '@ui'

@Component({
  selector: 'app-loan-info',
  templateUrl: './loan-info.component.html',
  styleUrls: ['./loan-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoanInfoComponent implements OnInit {

  public loan$ = this.ui.loan$;

  constructor(
    private ui: UIStoreService
  ) { }

  ngOnInit() {
  }

}

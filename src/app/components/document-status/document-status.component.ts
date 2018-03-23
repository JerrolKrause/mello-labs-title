import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ApiService } from '@api';
import { UIStoreService } from '@ui';

@Component({
  selector: 'app-document-status',
  templateUrl: './document-status.component.html',
  styleUrls: ['./document-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentStatusComponent implements OnInit {

  public loanCurrentDocs$ = this.api.loanCurrentDocs$;

  public documents = {};

  public hasUpdates = false;

  constructor(
    public ui: UIStoreService,
    private api: ApiService
  ) { }

  ngOnInit() {
  }

  public updateStatus() {
    this.hasUpdates = true;
  }

}

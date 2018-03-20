import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '@api';
import { UIStoreService } from '@ui';

@Component({
  selector: 'app-exception',
  templateUrl: './exception.component.html',
  styleUrls: ['./exception.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExceptionComponent implements OnInit {

  constructor(
    public activeModal: NgbActiveModal,
    public ui: UIStoreService,
    private api: ApiService
  ) { }

  ngOnInit() {
  }

}

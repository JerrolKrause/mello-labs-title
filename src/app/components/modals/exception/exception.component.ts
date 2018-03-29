import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UIStoreService } from '@ui';

@Component({
  selector: 'app-exception',
  templateUrl: './exception.component.html',
  styleUrls: ['./exception.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExceptionComponent implements OnInit {
  public waiting: boolean;

  constructor(public activeModal: NgbActiveModal, public ui: UIStoreService) {}

  ngOnInit() {}
}

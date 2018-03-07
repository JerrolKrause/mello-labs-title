import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { UIStoreService } from '@ui'


@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewerComponent implements OnInit {

  constructor(
    public ui: UIStoreService
  ) { }

  ngOnInit() {
 
  }

  

}

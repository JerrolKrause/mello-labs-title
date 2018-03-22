import { Component, OnInit, ChangeDetectionStrategy, Input, OnChanges } from '@angular/core';
import { UIStoreService } from '@ui'

import { ApiService, ApiProps } from '@api'
import * as _ from 'lodash';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-document-viewer',
  templateUrl: './document-viewer.component.html',
  styleUrls: ['./document-viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentViewerComponent implements OnInit, OnChanges {

  @Input() docGuid: string;
  @Input() multiScreen: boolean;
  @Input() multiDocs: boolean;
  @Input() docs: any;
  @Input() instance: number;

  constructor(
    public ui: UIStoreService,
    private api: ApiService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
  /*
    // Fake document changing on route change
    this.route.params.subscribe(params => {
      if (this.docs) {
        this.ui.docViewerChange(_.shuffle(this.docs)[0].docGuid);
      }
    });

    let docsSub = this.loanCurrentDocs$.subscribe((docs :any) => {
      if (docs && docs.src) {
        this.docs = docs.src;
        this.ui.docViewerChange(docs.src[0].docGuid);
        if (docsSub){
          docsSub.unsubscribe();
        }
      }
    });
    */
  }

  ngOnChanges() {
    if (this.docs && this.docs.src.length && !this.docGuid) {
      this.docGuid = this.docs.src[0].docGuid;
    }

  }

}

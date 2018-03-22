import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
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
export class DocumentViewerComponent implements OnInit {
  public loanCurrentDocs;
  public loanCurrentDocs$ = this.api.loanCurrentDocs$;
  public loanCurrentDocsStatus$ = this.api.getState$(ApiProps.loanCurrentDocs);

  public docs;

  constructor(
    public ui: UIStoreService,
    private api: ApiService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {

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

  }

}

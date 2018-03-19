import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { UIStoreService } from '@ui'

import { ApiService, ApiProps } from '@api'

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewerComponent implements OnInit {

  public loanCurrentDocs$ = this.api.loanCurrentDocs$;
  public loanCurrentDocsStatus$ = this.api.getState$(ApiProps.loanCurrentDocs);
  public docGuid$ = this.ui.docGuid$;

  constructor(
    public ui: UIStoreService,
    private api: ApiService
  ) { }

  ngOnInit() {

    let docsSub = this.loanCurrentDocs$.subscribe((docs :any) => {
      if (docs && docs.src) {
        this.ui.docViewerChange(docs.src[0].docGuid);
        if (docsSub){
          docsSub.unsubscribe();
        }
      }
    });

  }

}

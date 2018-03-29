import { Component, OnInit, ChangeDetectionStrategy, Input, OnChanges } from '@angular/core';
import { UIStoreService } from '@ui'

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-document-viewer',
  templateUrl: './document-viewer.component.html',
  styleUrls: ['./document-viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentViewerComponent implements OnInit, OnChanges {

  @Input() docGuid: string;
  @Input() bounds: {
    h: number;
    w: number;
    x: number;
    y: number;
  };
  @Input() pageNumber: number;
  @Input() multiScreen: boolean;
  @Input() multiDocs: boolean;
  @Input() docs: any;
  @Input() instance: number;

  public lnkey: string;

  public webLinks = [
    {
      label: 'USPS Address Verification',
      url: 'https://tools.usps.com/go/ZipLookupResultsAction!input.action'
    },
    {
      label: 'Title Request Form',
      url: 'http://ldcorp/dept/IT/SitePages/Home.aspx'
    },
  ]

  public demo = false;

  constructor(
    public ui: UIStoreService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {



    this.route.params.subscribe(params => {
      if (params) {
        this.lnkey = params.lnkey;
      }
    });

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

  public windowOpen(url: string) {
    window.open(url);
  }

  ngOnChanges() {
    if (this.docs && this.docs.src.length && !this.docGuid) {
      this.docGuid = this.docs.src[0].docGuid;
    }

  }



}

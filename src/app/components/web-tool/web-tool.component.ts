import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-web-tool',
  templateUrl: './web-tool.component.html',
  styleUrls: ['./web-tool.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WebToolComponent implements OnInit {

  public iframeUrl = 'https://tools.usps.com/go/ZipLookupResultsAction!input.action'//'http://localhost:4206';

  constructor() { }

  ngOnInit() {
  }

}

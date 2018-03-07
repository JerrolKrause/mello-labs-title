import { Component } from '@angular/core';
import { PostMessageService } from '@shared';

@Component({
  selector: 'app-no-content',
  templateUrl: './no-content.component.html'
})
export class NoContentComponent {

  constructor(
    private messaging: PostMessageService
  ) {
    this.messaging.listenForMessages(['http://localhost:4205']).subscribe(message => console.log('Message from Doc Portfolio', message))
  }

  public postMessage() {
    let msg = {
      event: 'Do Cool Stuff',
      payload: { hello: 'World' }
    };
    this.messaging.postMessage('iframe', msg, 'http://localhost:4205', 'docPortfolio');
  }

}

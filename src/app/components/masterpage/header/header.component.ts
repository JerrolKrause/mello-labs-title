import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  styles: [`
  #logo {height: 45px;position: relative;display:block;min-width: 200px;}
  strong{    color: #5c2d91;}
  .logo{background: url(./assets/img/title-workflow-logo.png) no-repeat 0 0;min-width: 132px;background-size: contain;display: block;height: 64px;position: absolute;    top: -3px;}
  `],
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {

  public isOpen = false;

  constructor(
    private router: Router
  ) {
  }

  public ngOnInit() {
    // On route change, close nav window
    this.router.events.subscribe(() => {
      this.isOpen = false;
    });
  }

}

import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { Title } from '@angular/platform-browser';
import { environment } from '../environments/environment.prod';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

import { AuthService, ServiceWorkerService, AppCommsService } from '@shared';
import { UIModalService } from '@ui';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private title: Title,
    private authService: AuthService,
    private swUpdate: SwUpdate,
    private modals: UIModalService,
    private sw: ServiceWorkerService,
    private comms: AppCommsService
  ) {
  }

  ngOnInit() {
    this.routeChange();
  }

  /**
  * Actions to perform on route change
  * Page titles are in app.routes.ts
  */
  public routeChange() {
    this.router.events
      .filter(event => event instanceof NavigationEnd)
      .map(() => this.activatedRoute)
      .map(route => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      })
      .filter(route => route.outlet === 'primary')
      .mergeMap(route => route.data)
      .subscribe((event) => {
        this.title.setTitle(event['title']); // Change document title
        // If auth endpoint is available and not on the login page
        if (this.authService.hasAuthEndpoint && this.router.url.toLowerCase().indexOf('login') === -1) {
          this.authService.refreshTokenUpdate(); // On Route change, refresh authentication token
        }
      });
  } // end routeChange
}
